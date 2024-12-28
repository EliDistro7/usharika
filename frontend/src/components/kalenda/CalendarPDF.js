

import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const generateWeeklySchedulePdf = (events) => {
  // Step 1: Format events for the PDF
  const tableBody = [
    [{ text: 'Day', bold: true }, { text: 'Event', bold: true }, { text: 'Time', bold: true }],
  ];

  events.forEach((event) => {
    const startDate = new Date(event.start);
    const endDate = new Date(event.end);
    const day = startDate.toLocaleDateString('en-US', { weekday: 'long' });
    const time = `${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${
      endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }`;

    tableBody.push([day, event.title, time]);
  });

  // Step 2: Define the PDF content
  const docDefinition = {
    content: [
      { text: 'Weekly Schedule', style: 'header' },
      { text: `Generated on: ${new Date().toLocaleDateString()}`, style: 'subheader' },
      { text: '\n' },
      {
        table: {
          headerRows: 1,
          widths: ['auto', '*', 'auto'], // Adjust column widths as needed
          body: tableBody,
        },
      },
    ],
    styles: {
      header: { fontSize: 18, bold: true, alignment: 'center' },
      subheader: { fontSize: 12, alignment: 'center', color: 'gray' },
    },
  };

  // Step 3: Generate and Download PDF
  pdfMake.createPdf(docDefinition).download('Weekly_Schedule.pdf');
};

// Example usage
const handleDownloadPdf = () => {
  // Sample events as per your `fullEvents` data
  const sampleEvents = [
    {
      title: 'Sherehe ya Mwaka Mpya',
      start: '2024-11-05T10:00:00.000Z',
      end: '2024-11-05T12:00:00.000Z',
    },
    {
      title: 'Kumbukumbu ya Watakatifu Wote',
      start: '2024-11-10T09:00:00.000Z',
      end: '2024-11-10T10:30:00.000Z',
    },
    // Add more events as needed
  ];

  generateWeeklySchedulePdf(sampleEvents);
};

export default function CalendarPDF() {
  return (
    <div>
      <button onClick={handleDownloadPdf}>Download Weekly Schedule as PDF</button>
    </div>
  );
}
