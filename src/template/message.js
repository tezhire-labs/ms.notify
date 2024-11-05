const core = require("@actions/core");
const { getWorkflowRun } = require("../utils");
const { convertToTimeZones } = require("../components/timezone");
const { getCurrentWorkflowConclusion } = require("../components/conclusion");
const { Fact, WebhookBody, CardSection, PotentialAction } = require("../model/models");

async function getMessage(isPost = false) {
    try {
        // Get workflow run details
        const {
            workflow,
            job,
            commitMessage
        } = await getWorkflowRun(isPost);

        if (!workflow || !workflow.head_repository) {
            throw new Error('Workflow or repository information is missing');
        }

        const repoUrl = workflow.head_repository.html_url;
        const branchUrl = `${repoUrl}/tree/${workflow.head_branch}`;
        const webhookBody = new WebhookBody();
        const section = new CardSection();
        webhookBody.sections.push(section);

        const repoName = workflow.head_repository.full_name;
        const repoNameDisplay = core.getInput('uppercase-repo-name', { required: false }).toLowerCase() === 'true'
            ? repoName.toUpperCase()
            : repoName;
        const actor_name = `\`${workflow.head_commit.author.name}\``;
        const event = `\`${workflow.event.toUpperCase()}\``;
        const status = `\`${getCurrentWorkflowConclusion(job.steps, isPost).toUpperCase()}\``;
        const commitUrl = `${repoUrl}/commit/${workflow.head_sha}`;
        const workflowUrl = `${repoUrl}/actions/runs/${workflow.id}`;
        const jobUrl = job.html_url;

        section.activityTitle = `**${workflow.name} [#${workflow.run_number}](${workflowUrl}) ([${workflow.head_sha.slice(0, 7)}](${commitUrl}))**`;
        section.activitySubtitle = `on [${repoNameDisplay}](${repoUrl})`;
        section.activityImage = workflow.actor.avatar_url;

        const { startDate, endDate } = convertToTimeZones(job);
        const facts = [];

        // Facts for the notification card
        // Show Author
        if (core.getInput('show-author', { required: false }).toLowerCase() === 'true') {
            facts.push(new Fact("Author:", actor_name));
        }

        // Show Event
        if (core.getInput('show-event', { required: false }).toLowerCase() === 'true') {
            facts.push(new Fact("Event:", event));
        }

        // Show Status
        if (core.getInput('show-status', { required: false }).toLowerCase() === 'true') {
            facts.push(new Fact("Status:", status));
        }

        // Show Branch
        if (core.getInput('show-branch', { required: false }).toLowerCase() === 'true') {
            facts.push(new Fact("Branch:", `[${workflow.head_branch.toUpperCase()}](${branchUrl})`));
        }

        // Show Job
        if (core.getInput('show-job', { required: false }).toLowerCase() === 'true') {
            facts.push(new Fact("Job:", `[${job.name}](${jobUrl})`));
        }

        // Show Start Time
        if (core.getInput('show-start-time', { required: false }).toLowerCase() === 'true' && !isPost) {
            facts.push(new Fact("Start Time:", startDate));
        }

        // Show End Time
        if (core.getInput('show-end-time', { required: false }).toLowerCase() === 'true' && isPost) {
            facts.push(new Fact("End Time:", endDate));
        }

        // Show Commit Message
        if (core.getInput('show-commit-message', { required: false }).toLowerCase() === 'true') {
            facts.push(new Fact("Commit Message:", commitMessage));
        }

        section.facts = facts;

        // console.log(startDate, endDate);

        // Buttons to be rendered in the notification card
        const actions = [];
        // View Workflow Button
        if (core.getInput('enable-view-workflow', { required: false }).toLowerCase() === 'true') {
            actions.push(new PotentialAction('View Workflow', [workflowUrl]));
        }

        // Review Changes Button
        if (core.getInput('enable-review-changes', { required: false }).toLowerCase() === 'true') {
            actions.push(new PotentialAction('Review Changes', [commitUrl]));
        }

        // View Job Button
        if (core.getInput('enable-view-job', { required: false }).toLowerCase() === 'true') {
            actions.push(new PotentialAction('Job Status', [jobUrl]));
        }

        section.potentialAction = actions;

        return webhookBody;
    } catch (error) {
        console.error('Error in getMessage:', error);
        throw error;
    }
}

module.exports = getMessage;