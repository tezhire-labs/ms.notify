const core = require('@actions/core');
const submitNotification = require('./components/submit');
const getMessage = require('./template/message');

async function main() {
    try {
        // Only proceed if main-message input exists
        if (core.getInput('main-message', { required: false }).toLowerCase() !== 'true') {
            console.log('No main-message provided, skipping notification');
            return;
        }

        const debugMode = core.getBooleanInput('debug', { required: false }) || false;
        const webhookBody = await getMessage(false);

        if (debugMode) {
            console.log(JSON.stringify(webhookBody, null, 2));
        }

        // Pass webhookBody to submitNotification
        await submitNotification(false);
    } catch (error) {
        console.error('Error in main:', error);
        core.setFailed(error.message);
    }
}

// Execute main function
main();