// script.js
import { allSchedules } from './data.js'; // Updated import path

// Helper function to convert time string (e.g., "09:00 AM") to minutes from midnight
function timeToMinutes(timeStr) {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0; // Midnight (12 AM)
    return hours * 60 + minutes;
}

const mainScheduleTitleLine1 = document.getElementById('main-schedule-title-line1');
const mainScheduleTitleLine2 = document.getElementById('main-schedule-title-line2');
const scheduleShortIdButton = document.getElementById('schedule-short-id-button');
const schoolLogo = document.getElementById('school-logo');
const scheduleDisplay = document.getElementById('schedule-display');
const daySelector = document.getElementById('day-selector');
const toggleModeBtn = document.getElementById('toggle-mode-btn');

// Modal elements
const scheduleModalOverlay = document.getElementById('scheduleModalOverlay');
const closeScheduleModalBtn = document.getElementById('close-schedule-modal');
const scheduleSearchInput = document.getElementById('schedule-search-input');
const scheduleList = document.getElementById('schedule-list');

let currentScheduleId = '';
let currentDayIndex = 0;
let currentMode = 'simplified';

// Map to store unique colors for each course name for consistent coloring
const courseColors = new Map();
const availableColors = [
    '#a7f3d0', '#bfdbfe', '#fecaca', '#fed7aa', '#dbeafe',
    '#fef08a', '#e9d5ff', '#bae6fd', '#fbcfe8', '#ccfbf1'
];
let colorIndex = 0;

function getCourseColor(courseName) {
    if (!courseColors.has(courseName)) {
        courseColors.set(courseName, availableColors[colorIndex % availableColors.length]);
        colorIndex++;
    }
    return courseColors.get(courseName);
}

/**
 * Populates the schedule list in the modal.
 * @param {Array} schedulesToDisplay - The array of schedules to display (filtered by search).
 */
function populateScheduleList(schedulesToDisplay) {
    scheduleList.innerHTML = '';
    if (schedulesToDisplay.length === 0) {
        scheduleList.innerHTML = '<li class="text-center text-gray-500 py-4">No schedules found.</li>';
        return;
    }
    schedulesToDisplay.forEach(schedule => {
        const listItem = document.createElement('li');
        listItem.classList.add('schedule-list-item');
        listItem.dataset.scheduleId = schedule.id;
        listItem.innerHTML = `
            <strong>${schedule.displayTitleLine1}</strong>
            <span>${schedule.displayTitleLine2}</span>
        `;
        listItem.addEventListener('click', () => {
            currentScheduleId = schedule.id;
            closeScheduleModal();
            renderCurrentModeSchedule();
        });
        scheduleList.appendChild(listItem);
    });
}

/**
 * Opens the schedule selection modal.
 */
function openScheduleModal() {
    populateScheduleList(allSchedules);
    scheduleSearchInput.value = '';
    scheduleModalOverlay.classList.add('show');
}

/**
 * Closes the schedule selection modal.
 */
function closeScheduleModal() {
    scheduleModalOverlay.classList.remove('show');
}

/**
 * Renders the schedule in Simplified (Day-by-Day Card) Mode.
 * @param {string} scheduleId - The ID of the schedule to render.
 * @param {number} selectedDayIdx - The index of the day to display in detail.
 */
function renderSimplifiedSchedule(scheduleId, selectedDayIdx) {
    const selectedSchedule = allSchedules.find(s => s.id === scheduleId);

    if (!selectedSchedule) {
        scheduleDisplay.innerHTML = '<p class="text-center text-red-500">Schedule not found.</p>';
        mainScheduleTitleLine1.textContent = 'No Schedule Selected';
        mainScheduleTitleLine2.textContent = '';
        scheduleShortIdButton.textContent = '';
        daySelector.innerHTML = '';
        daySelector.classList.add('hidden');
        return;
    }

    if (selectedDayIdx < 0) selectedDayIdx = 0;
    if (selectedDayIdx >= selectedSchedule.days.length) selectedDayIdx = selectedSchedule.days.length - 1;
    currentDayIndex = selectedDayIdx;

    mainScheduleTitleLine1.textContent = selectedSchedule.displayTitleLine1;
    mainScheduleTitleLine2.textContent = selectedSchedule.displayTitleLine2;
    scheduleShortIdButton.textContent = selectedSchedule.shortId;

    daySelector.innerHTML = '';
    daySelector.classList.remove('hidden');
    selectedSchedule.days.forEach((day, index) => {
        const dayButton = document.createElement('button');
        dayButton.classList.add('day-button');
        dayButton.textContent = day.substring(0, 3);
        dayButton.dataset.dayIndex = index;

        if (index === currentDayIndex) {
            dayButton.classList.add('active');
        }

        dayButton.addEventListener('click', () => {
            renderSimplifiedSchedule(scheduleId, index);
        });
        daySelector.appendChild(dayButton);
    });

    const dayName = selectedSchedule.days[currentDayIndex];
    const coursesForDay = selectedSchedule.courses
        .filter(course => course.day === dayName)
        .sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));

    let dayContentHTML = '';
    if (coursesForDay.length === 0) {
        dayContentHTML = `<p class="text-center text-gray-500 py-8">No classes scheduled for ${dayName}. Enjoy your free time!</p>`;
    } else {
        const now = new Date();
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][now.getDay()];

        coursesForDay.forEach(course => {
            const courseStartMinutes = timeToMinutes(course.time);
            const courseEndMinutes = timeToMinutes(course.endTime);
            const isCurrentCourse = (
                dayName === todayDayName &&
                currentMinutes >= courseStartMinutes &&
                currentMinutes < courseEndMinutes
            );
            const isUpcomingCourse = (
                dayName === todayDayName &&
                currentMinutes < courseStartMinutes &&
                !isCurrentCourse
            );

            let highlightClass = '';
            if (isCurrentCourse || isUpcomingCourse) {
                highlightClass = 'current-course-highlight';
            }

            const courseColor = getCourseColor(course.name);

            dayContentHTML += `
                <div class="course-card ${highlightClass}" style="background-color: ${courseColor};">
                    <div class="course-card-header">${course.name}</div>
                    <div class="course-card-details">
                        <p>${course.time} - ${course.endTime}</p>
                        <p>Room: ${course.room}</p>
                    </div>
                </div>
            `;
        });
    }
    scheduleDisplay.innerHTML = dayContentHTML;
    scheduleDisplay.classList.add('schedule-day-container');
    scheduleDisplay.classList.remove('schedule-table', 'overflow-x-auto');
}

/**
 * Renders the schedule in Table Mode.
 * @param {string} scheduleId - The ID of the schedule to render.
 */
function renderTableSchedule(scheduleId) {
    const selectedSchedule = allSchedules.find(s => s.id === scheduleId);

    if (!selectedSchedule) {
        scheduleDisplay.innerHTML = '<p class="text-center text-red-500">Schedule not found.</p>';
        mainScheduleTitleLine1.textContent = 'No Schedule Selected';
        mainScheduleTitleLine2.textContent = '';
        scheduleShortIdButton.textContent = '';
        daySelector.innerHTML = '';
        daySelector.classList.add('hidden');
        return;
    }

    mainScheduleTitleLine1.textContent = selectedSchedule.displayTitleLine1;
    mainScheduleTitleLine2.textContent = selectedSchedule.displayTitleLine2;
    scheduleShortIdButton.textContent = selectedSchedule.shortId;
    daySelector.classList.add('hidden');

    const allUniqueTimesForSchedule = new Set();
    selectedSchedule.courses.forEach(course => {
        allUniqueTimesForSchedule.add(course.time);
        allUniqueTimesForSchedule.add(course.endTime);
    });
    const sortedUniqueTimesForSchedule = Array.from(allUniqueTimesForSchedule).sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

    const scheduleTimeSlots = sortedUniqueTimesForSchedule.filter((time, index, arr) => {
        const isCourseStartTime = selectedSchedule.courses.some(course => course.time === time);
        const isFirstTime = (index === 0);
        return isCourseStartTime || isFirstTime;
    });

    if (scheduleTimeSlots.length === 0 && selectedSchedule.courses.length > 0) {
        scheduleTimeSlots.push(...Array.from(new Set(selectedSchedule.courses.map(c => c.time))).sort((a, b) => timeToMinutes(a) - timeToMinutes(b)));
    }

    const bookedCells = Array(scheduleTimeSlots.length).fill(0).map(() => Array(selectedSchedule.days.length).fill(false));

    let tableHTML = `
        <table class="schedule-table">
            <thead>
                <tr>
                    <th class="rounded-tl-lg">Time</th>
    `;
    const now = new Date();
    const currentDayOfWeek = now.getDay();
    const dayNamesFull = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    selectedSchedule.days.forEach((day, dayIndex) => {
        const isCurrentDay = dayNamesFull.indexOf(day) === currentDayOfWeek;
        tableHTML += `<th class="${isCurrentDay ? 'current-day-table-header' : ''} ${dayIndex === selectedSchedule.days.length - 1 ? 'rounded-tr-lg' : ''}">${day}</th>`;
    });
    tableHTML += `
                </tr>
            </thead>
            <tbody>
    `;

    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    scheduleTimeSlots.forEach((time, rowIndex) => {
        const timeSlotMinutes = timeToMinutes(time);
        const isCurrentTimeRow = (timeSlotMinutes <= currentMinutes &&
                                  (rowIndex + 1 < scheduleTimeSlots.length ? timeToMinutes(scheduleTimeSlots[rowIndex + 1]) : Infinity) > currentMinutes);

        tableHTML += `<tr class="${isCurrentTimeRow ? 'current-time-row-table' : ''}"><td data-label="Time">${time}</td>`;

        selectedSchedule.days.forEach((day, colIndex) => {
            if (bookedCells[rowIndex][colIndex]) {
                return;
            }

            const coursesStartingAtSlot = selectedSchedule.courses.filter(c => c.time === time && c.day === day);

            if (coursesStartingAtSlot.length > 0) {
                const course = coursesStartingAtSlot[0];
                const startIdx = scheduleTimeSlots.indexOf(course.time);
                const endIdx = scheduleTimeSlots.indexOf(course.endTime);
                const rowspan = (endIdx !== -1 && startIdx !== -1) ? (endIdx - startIdx) : 1;

                const courseColor = getCourseColor(course.name);

                for (let i = 0; i < rowspan; i++) {
                    if (rowIndex + i < bookedCells.length) {
                        bookedCells[rowIndex + i][colIndex] = true;
                    }
                }

                const isCurrentCellHighlight = (isCurrentTimeRow && dayNamesFull.indexOf(day) === currentDayOfWeek);

                tableHTML += `
                    <td data-label="${day}" rowspan="${rowspan}" class="${isCurrentCellHighlight ? 'current-time-cell-table' : ''}">
                        <div class="table-schedule-cell-content" style="background-color: ${courseColor};">
                            <strong>${course.name}</strong>
                            <span>${course.time} - ${course.endTime}</span>
                            <span>${course.room}</span>
                        </div>
                    </td>
                `;
            } else {
                tableHTML += `<td data-label="${day}"></td>`;
            }
        });
        tableHTML += `</tr>`;
    });

    tableHTML += `
            </tbody>
        </table>
    `;
    scheduleDisplay.innerHTML = tableHTML;
    scheduleDisplay.classList.remove('schedule-day-container');
    scheduleDisplay.classList.add('schedule-table', 'overflow-x-auto');
}


/**
 * Renders the schedule based on the current mode.
 */
function renderCurrentModeSchedule() {
    if (currentMode === 'simplified') {
        const selectedSchedule = allSchedules.find(s => s.id === currentScheduleId);
        const today = new Date();
        const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][today.getDay()];
        const todayIdx = selectedSchedule ? selectedSchedule.days.indexOf(todayDayName) : -1;
        renderSimplifiedSchedule(currentScheduleId, todayIdx !== -1 ? todayIdx : 0);
    } else { // 'table' mode
        renderTableSchedule(currentScheduleId);
    }
}

// Event listener for toggle mode button
toggleModeBtn.addEventListener('click', () => {
    currentMode = (currentMode === 'simplified') ? 'table' : 'simplified';
    toggleModeBtn.textContent = (currentMode === 'simplified') ? 'SIMPLE MODE' : 'TABLE MODE';
    renderCurrentModeSchedule();
});

// Event listener for opening the schedule modal
scheduleShortIdButton.addEventListener('click', openScheduleModal);
closeScheduleModalBtn.addEventListener('click', closeScheduleModal);

// Event listener for search input in modal
scheduleSearchInput.addEventListener('input', (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredSchedules = allSchedules.filter(schedule =>
        schedule.name.toLowerCase().includes(searchTerm) ||
        schedule.displayTitleLine1.toLowerCase().includes(searchTerm) ||
        schedule.displayTitleLine2.toLowerCase().includes(searchTerm) ||
        schedule.shortId.toLowerCase().includes(searchTerm)
    );
    populateScheduleList(filteredSchedules);
});


// Initial load: populate dropdown and render the first schedule's current/first day
document.addEventListener('DOMContentLoaded', () => {
    if (allSchedules.length > 0) {
        currentScheduleId = allSchedules[0].id;
        toggleModeBtn.textContent = 'SIMPLE MODE';
        renderCurrentModeSchedule();
    } else {
        scheduleDisplay.innerHTML = '<p class="text-center text-gray-500">No schedules available.</p>';
        mainScheduleTitleLine1.textContent = 'No Schedule Available';
        mainScheduleTitleLine2.textContent = '';
        scheduleShortIdButton.textContent = '';
        daySelector.innerHTML = '';
        daySelector.classList.add('hidden');
        toggleModeBtn.disabled = true;
        scheduleShortIdButton.disabled = true;
    }

    // --- Service Worker Registration ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                })
                .catch(err => {
                    console.error('ServiceWorker registration failed: ', err);
                });
        });
    }
});
