// schedules/ioa-bsa-1-1st-2025-2026.js
export const firstSemSchedule = {
    id: 'ioa-bsa-1-1stsem-year-1', // Updated ID to match file name
    name: 'IOA-BSA-1 1st Semester - Year 1',
    displayTitleLine1: 'BSA-1 | 1st Semester',
    displayTitleLine2: 'Year 1 - A.Y. 2025-2026',
    shortId: 'IOA-BSA-1',
    days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    courses: [
        // Monday Classes
        { time: '09:00 AM', endTime: '10:30 AM', day: 'Monday', name: 'ART APPRECIATION', room: 'HPSB - 1013 / VR-MON' },
        { time: '10:30 AM', endTime: '12:00 PM', day: 'Monday', name: 'PURPOSIVE COMMUNICATION', room: 'HPSB - 1014 / VR-MON' },
        { time: '01:30 PM', endTime: '03:00 PM', day: 'Monday', name: 'SCIENCE, TECHNOLOGY AND SOCIETY', room: 'VR-MON, THU' },

        // Tuesday Classes
        { time: '09:00 AM', endTime: '12:00 PM', day: 'Tuesday', name: 'FINANCIAL ACCOUNTING & REPORTING 1', room: 'HPSB - 1011' },

        // Thursday Classes
        { time: '01:30 PM', endTime: '03:00 PM', day: 'Thursday', name: 'SCIENCE, TECHNOLOGY AND SOCIETY', room: 'VR-MON, THU' },
        { time: '06:00 PM', endTime: '09:00 PM', day: 'Thursday', name: 'PROFESSIONAL ELECTIVE 1', room: 'VR-THU' },
        { time: '03:00 PM', endTime: '05:00 PM', day: 'Thursday', name: 'PHYSICAL ACTIVITIES TOWARD HEALTH AND FITNESS 1', room: 'OVAL - Track Oval B' },

        // Friday Classes
        { time: '03:00 PM', endTime: '04:30 PM', day: 'Friday', name: 'OPERATION MANAGEMENT AND TQM', room: 'HPSB - 1014' },
        { time: '01:30 PM', endTime: '03:00 PM', day: 'Friday', name: 'ECONOMIC DEVELOPMENT', room: 'HPSB - 1014' },
        { time: '10:30 AM', endTime: '12:00 PM', day: 'Friday', name: 'MAKATI HERITAGE STUDIES 1', room: 'VR-FRI' },
        { time: '03:00 PM', endTime: '04:30 PM', day: 'Friday', name: 'OPERATION MANAGEMENT AND TQM', room: 'HPSB - 1014' },
        { time: '01:30 PM', endTime: '03:00 PM', day: 'Friday', name: 'ECONOMIC DEVELOPMENT', room: 'HPSB - 1014' },

        // Saturday Classes
        { time: '04:30 PM', endTime: '07:30 PM', day: 'Saturday', name: 'CWTS 1', room: 'B3 - 304' }
    ]
};
