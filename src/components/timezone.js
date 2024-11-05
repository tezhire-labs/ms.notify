const core = require("@actions/core");

const convertUTCToLocalTime = (utcTime) => {
    if (!utcTime) return 'N/A';

    // Parse the UTC time as a Date object
    const utcDate = new Date(utcTime);
    const timezone = core.getInput('timezone');
    const dateStyle = core.getInput('date-style');
    const timeStyle = core.getInput('time-style');

    // console.log('Timezone:', timezone);

    // Use the system's local time for conversion
    const localTime = utcDate.toLocaleString('en-US', {
        timeZone: timezone,
        hour12: true,
        dateStyle: dateStyle,
        timeStyle: timeStyle
    });

    return localTime;
};

const convertToTimeZones = (job) => {
    if (!job || !job.steps) {
        return {
            startDate: 'N/A',
            endDate: 'N/A'
        };
    }

    // console.log('Job steps data:', JSON.stringify(job.steps, null, 2));

    const steps = job.steps;
    const firstStep = steps.find(step => step.started_at);
    const lastStep = steps.findLast(step => step.completed_at);

    return {
        startDate: convertUTCToLocalTime(firstStep?.started_at) || 'N/A',
        endDate: convertUTCToLocalTime(lastStep?.completed_at) || 'N/A'
    };
};

module.exports = {
    convertToTimeZones
};