const core = require("@actions/core");
const github = require("@actions/github");
const { Octokit } = require("@octokit/rest");
const { getCurrentWorkflowConclusion } = require("./components/conclusion");

async function getWorkflowRun(isPost = false) {
  try {
    // Get Inputs
    const githubToken = core.getInput('github-token');
    const runId = github.context.runId; // Use the current workflow run ID
    const octokit = new Octokit({ auth: githubToken });

    // Log the current context information
    // console.log("Current Run ID:", runId);
    // console.log("Repository Owner:", github.context.repo.owner);
    // console.log("Repository Name:", github.context.repo.repo);

    // Get Workflow Run details based on the current run
    const workflowRun = await octokit.rest.actions.getWorkflowRun({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      run_id: runId
    });

    // console.log("Workflow Run Data:", workflowRun.data);

    // Get Workflow Jobs for the current run
    const workflowJobs = await octokit.rest.actions.listJobsForWorkflowRun({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      run_id: runId
    });

    // console.log("Workflow Jobs Data:", workflowJobs.data);

    // Find the current job within the list of jobs
    const currentJob = workflowJobs.data.jobs.find(job => job.name === github.context.job);

    if (!currentJob) {
      throw new Error(`Current job ${github.context.job} not found in workflow jobs.`);
    }

    // console.log("Current Job Data:", currentJob);

    // Fetch details of the current job's steps
    const steps = currentJob.steps;
    const conclusion = getCurrentWorkflowConclusion(steps, isPost);
    
    // console.log("Conclusion:", conclusion);

    // Get previous workflow run
    const previousRuns = await octokit.rest.actions.listWorkflowRuns({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      workflow_id: workflowRun.data.workflow_id,
      status: 'completed',
      per_page: 1
    });

    let compareBasehead;
    if (previousRuns.data.workflow_runs.length > 0) {
      const previousRun = previousRuns.data.workflow_runs[0];
      compareBasehead = `${previousRun.head_sha}...${workflowRun.data.head_commit.id}`;
    } else {
      // Fallback to comparing with parent commit if no previous workflow run exists
      compareBasehead = `${workflowRun.data.head_commit.parent_id}...${workflowRun.data.head_commit.id}`;
    }

    // Get commits between the previous workflow run and current run
    const commits = await octokit.rest.repos.compareCommitsWithBasehead({
      owner: github.context.repo.owner,
      repo: github.context.repo.repo,
      basehead: compareBasehead
    });

    // Extract commit messages into a list
    const commitMessages = commits.data.commits.map(commit => commit.commit.message);
    const totalCommits = commits.data.total_commits;

    // console.log("Number of Commits:", totalCommits);
    // console.log("Commit Messages:", commitMessages);

    return {
      workflow: workflowRun.data,
      conclusion,
      job: currentJob,
      commits: {
        total: totalCommits,
        messages: commitMessages
      }
    };

  } catch (error) {
    core.setFailed(error.message);
    throw error;
  }
}

module.exports = {
  getWorkflowRun
};
