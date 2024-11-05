const core = require('@actions/core');
const submitNotification = require('./components/submit');
const getMessage = require('./template/message');

async function post() {
  try {
    // Only proceed if main-message input exists
    if (core.getInput('post-message', { required: false }).toLowerCase() !== 'true') {
      console.log('No post-message provided, skipping notification');
      return;
    }

    const debugMode = core.getBooleanInput('debug', { required: false }) || false;
    const webhookBody = await getMessage(true);

    if (debugMode) {
      console.log(JSON.stringify(webhookBody, null, 2));
    }

    // Pass webhookBody to submitNotification
    await submitNotification(true);
  } catch (error) {
    console.error('Error in post:', error);
    core.setFailed(error.message);
  }
}

// Execute post function
post();