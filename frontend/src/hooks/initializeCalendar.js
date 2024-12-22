

export function initializeCalendar(setSelectedEvent, setModalOpen) {
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
    const currentYear = today.getFullYear();

    // Events with start and end times
    const events = [
        { title: 'Sherehe ya Mwaka Mpya', monthDay: '11-05', startTime: '10:00', endTime: '12:00' },
        { title: 'Kumbukumbu ya Watakatifu Wote', monthDay: '11-10', startTime: '09:00', endTime: '10:30' },
        { title: 'Sherehe ya Kutahiriwa kwa Bwana Wetu', monthDay: '11-12', startTime: '11:00', endTime: '13:00' },
        { title: 'Sikukuu ya Mavuno', monthDay: '11-14', startTime: '08:00', endTime: '09:00' },
        { title: 'Sikukuu ya Mtakatifu Yohana Mwinjilisti', monthDay: '11-20', startTime: '17:00', endTime: '18:30' },
        { title: 'Misa ya Shukrani kwa Familia', monthDay: '11-18', startTime: '07:30', endTime: '09:00' },
        { title: 'Ijumaa ya Maombi ya Amani', monthDay: '11-24', startTime: '15:00', endTime: '16:30' },
        { title: 'Sikukuu ya Bikira Maria', monthDay: '12-08', startTime: '10:00', endTime: '11:30' },
        { title: 'Ibada ya Krismasi ya Watoto', monthDay: '12-16', startTime: '14:00', endTime: '15:30' },
        { title: 'Ibada ya Kukuza Imani', monthDay: '12-18', startTime: '09:30', endTime: '11:00' },
        { title: 'Sherehe ya Kuzaliwa kwa Yesu', monthDay: '12-25', startTime: '10:00', endTime: '12:00' },
        { title: 'Sikukuu ya Watakatifu Wote', monthDay: '12-31', startTime: '18:00', endTime: '20:00' },
    ];

    // Generate full dates for events
    const fullEvents = events.map((event) => {
        const [month, day] = event.monthDay.split('-');
        const start = new Date(`${currentYear}-${month}-${day}T${event.startTime}`);
        const end = new Date(`${currentYear}-${month}-${day}T${event.endTime}`);

        return {
            title: event.title,
            start: start.toISOString(), // Convert to ISO format for FullCalendar
            end: end.toISOString(),
        };
    });

    const calendar = new window.FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
        },
        events: fullEvents,
        eventClick: (info) => {
            console.log('log event', info.event._instance.range.end);
            setSelectedEvent({
                title: info.event.title,
               start: info.event._instance.range.start.toISOString(), // Convert to ISO string if needed
               end: info.event._instance.range.end.toISOString(), // Convert to ISO string if needed
               extendedProps: info.event.extendedProps, // Access additional props
            });
            setModalOpen(true); // Open modal
        },
    });

    calendar.render();
}
