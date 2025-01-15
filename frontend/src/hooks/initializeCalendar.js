export function initializeCalendar(setSelectedEvent, setModalOpen, setEvents, setViewType) {
    if (!window.FullCalendar) {
        console.error('FullCalendar is not available globally. Check the root layout script.');
        return;
    }

    const calendarEl = document.getElementById('calendar');
    if (!calendarEl) {
        console.error('Calendar element not found. Aborting calendar initialization.');
        return;
    }

    const today = new Date();

    // Choir rehearsal events from January 15th to the end of the month
    const events = [
        // Weekdays (12 PM - 9 PM)
        ...Array.from({ length: 12 }, (_, i) => {
            const date = new Date(today.getTime());
            date.setDate(today.getDate() + i); // Add days from today

            // Only add weekdays (Mon-Fri)
            if (date.getDay() !== 0 && date.getDay() !== 6) {
                return {
                    title: 'Mazoezi ya Uimbaji',
                    start: new Date(date.setHours(12, 0, 0, 0)).toISOString(),
                    end: new Date(date.setHours(21, 0, 0, 0)).toISOString(),
                    group: 'Kwaya ya Umoja wa Vijana',
                };
            }
        }).filter(Boolean),

        // Sundays (4 AM - 1 PM)
        ...Array.from({ length: 9 }, (_, i) => {
            const date = new Date(today.getTime());
            date.setDate(today.getDate() + i * 7); // Every Sunday for 3 weeks from today

            // Only add Sundays
            if (date.getDay() === 0) {
                return {
                    title: 'Mazoezi ya Uimbaji',
                    start: new Date(date.setHours(4, 0, 0, 0)).toISOString(),
                    end: new Date(date.setHours(13, 0, 0, 0)).toISOString(),
                    group: 'Kwaya ya Umoja wa Vijana',
                };
            }
        }).filter(Boolean),
    ];

    const fullEvents = events.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        group: event.group, // Include group information
    }));

    // Pass the events back to the parent component
    setEvents(fullEvents);

    const calendar = new window.FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        events: fullEvents,
        eventClick: (info) => {
            setSelectedEvent({
                title: info.event.title,
                start: info.event.start.toISOString(),
                end: info.event.end.toISOString(),
                group: info.event.extendedProps.group, // Include group in modal data
            });
            setModalOpen(true);
        },
        datesSet: (info) => {
            // Capture the current view type and pass it back to the parent component
            setViewType(info.view.type);
        },
    });

    calendar.render();
}
