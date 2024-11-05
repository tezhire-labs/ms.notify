function getCurrentWorkflowConclusion(steps, isPost = false) {
    // Handle cases where steps is undefined or empty
    if (!steps || !Array.isArray(steps) || steps.length === 0) {
        return 'pending';
    }

    // If called from main function, return 'Started'
    if (!isPost) {
        return 'Started';
    }

    // Find current step index
    const currentStepIndex = steps.findIndex(step => step.status === 'in_progress');

    // For post function, check all steps except current
    let hasFailure = false;
    let hasCancelled = false;
    let hasSuccess = false;
    let hasSkipped = false;
    let hasInProgress = false;

    // Iterate through all steps before the current step
    steps.forEach((step, index) => {
        // Skip the current step
        if (index === currentStepIndex) {
            return;
        }

        switch (step.conclusion) {
            case 'failure':
                hasFailure = true;
                break;
            case 'cancelled':
                hasCancelled = true;
                break;
            case 'success':
                hasSuccess = true;
                break;
            case 'skipped':
                hasSkipped = true;
                break;
            default:
                if (step.status === 'in_progress' && index !== currentStepIndex) {
                    hasInProgress = true;
                }
        }
    });

    // Return status based on priority
    if (hasFailure) {
        return 'failure';
    }
    if (hasCancelled) {
        return 'cancelled';
    }
    if (hasInProgress) {
        return 'in_progress';
    }
    // If all previous steps were skipped
    if (!hasSuccess && hasSkipped) {
        return 'skipped';
    }
    // If any previous step completed successfully
    if (hasSuccess) {
        return 'Completed';
    }

    // If we're at the first step or no previous steps have completed
    return 'in_progress';
}

module.exports = {
    getCurrentWorkflowConclusion
};