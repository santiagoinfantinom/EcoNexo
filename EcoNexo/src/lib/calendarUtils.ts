
export interface CalendarEvent {
    title: string;
    description: string;
    location: string;
    startDate: string; // ISO format
    endDate?: string;   // ISO format
    url?: string;
}

export function generateGoogleCalendarLink(event: CalendarEvent): string {
    const start = event.startDate.replace(/-/g, '').replace(/:/g, '').split('.')[0] + 'Z';
    const end = event.endDate
        ? event.endDate.replace(/-/g, '').replace(/:/g, '').split('.')[0] + 'Z'
        : start;

    const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: event.title,
        details: `${event.description}${event.url ? `\n\nMore info: ${event.url}` : ''}`,
        location: event.location,
        dates: `${start}/${end}`,
    });

    return `https://www.google.com/calendar/render?${params.toString()}`;
}

export function generateOutlookCalendarLink(event: CalendarEvent): string {
    const start = event.startDate;
    const end = event.endDate || event.startDate;

    const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        startdt: start,
        enddt: end,
        subject: event.title,
        body: `${event.description}${event.url ? `\n\nMore info: ${event.url}` : ''}`,
        location: event.location,
    });

    return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function generateICSFileContent(event: CalendarEvent): string {
    const start = event.startDate.replace(/-/g, '').replace(/:/g, '').split('.')[0] + 'Z';
    const end = event.endDate
        ? event.endDate.replace(/-/g, '').replace(/:/g, '').split('.')[0] + 'Z'
        : start;

    return [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PROID:-//EcoNexo//EN',
        'BEGIN:VEVENT',
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${event.title}`,
        `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}${event.url ? `\\n\\nMore info: ${event.url}` : ''}`,
        `LOCATION:${event.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ].join('\r\n');
}

export function downloadICSFile(event: CalendarEvent) {
    const content = generateICSFileContent(event);
    const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${event.title.replace(/\s+/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
