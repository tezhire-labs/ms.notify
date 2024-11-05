const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const getMessage = require('../template/message');
const { getInput, info, setFailed } = require('@actions/core');

async function submitNotification(isPost = false) {
    const webhookUri = getInput("webhook-uri", { required: true });
    const webhookBody = await getMessage(isPost);
    const webhookBodyJson = JSON.stringify(webhookBody);

    // info(`Final webhook body before submission: ${webhookBodyJson}`);

    try {
        const response = await fetch(webhookUri, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: webhookBodyJson,
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        info("Webhook submitted successfully");
        return response;
    } catch (error) {
        console.error("Error in submitNotification:", error);
        setFailed(error.message);
    }
}

module.exports = submitNotification;
