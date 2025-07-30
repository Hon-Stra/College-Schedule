// data.js
import { firstSemSchedule } from './schedules/ioa-bsa-1-1st-2025-2026.js';
import { spring2026Schedule } from './schedules/eng-ee-1-spring-2026.js';
import { dhmfirstsemschedule } from './schedules/cthm-dhm-1-1st-2025-2026.js';

// Add new schedules imports here as you create new files in the schedules/ folder
// import { yourNewSchedule } from './schedules/your-new-schedule-file.js';

export const allSchedules = [
    firstSemSchedule,
    spring2026Schedule,
    dhmfirstsemschedule,
    // Add new schedule objects here
    // yourNewSchedule,
];
