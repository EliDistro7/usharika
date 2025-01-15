import jsPDF from 'jspdf';
import 'jspdf-autotable';

export function generateTimetable(events, viewType, dateRange) {
    const doc = new jsPDF();
    const normalPurple = [128, 0, 128]; // Normal purple color

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...normalPurple);
    doc.text('KKKT Usharika wa Yombo', doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

    // Subtitle and Date Range
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text('Ratiba ya Vipindi Mbali Mbali Kanisani', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });
    doc.setFontSize(10);
    doc.text(`Muda wa Ratiba: ${dateRange}`, doc.internal.pageSize.getWidth() / 2, 32, { align: 'center' });

    // Table Data
    const tableData = events.map((event) => [
        event.start.split('T')[0], // Date (YYYY-MM-DD)
        event.start.split('T')[1].slice(0, 5), // Start Time (HH:MM)
        event.end.split('T')[1].slice(0, 5), // End Time (HH:MM)
        event.title,
    ]);

    // Add Table
    doc.autoTable({
        startY: 40, // Start below the title and date range
        head: [['Tarehe', 'Kuanza', 'Kumaliza', 'Kipindi']],
        body: tableData,
        styles: {
            fillColor: normalPurple,
            textColor: [255, 255, 255],
        },
        headStyles: {
            fillColor: normalPurple,
            textColor: [255, 255, 255],
            fontStyle: 'bold',
        },
    });

    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);

        // Footer text
        doc.setFontSize(10);
        doc.setTextColor(100);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        doc.text('Imetengenezwa na KKKT Yombo system', pageWidth / 2, pageHeight - 15, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - 20, pageHeight - 15, { align: 'right' });
    }

    // Save the PDF
    doc.save('KKKT_Usharika_wa_Ukonga_Timetable.pdf');
}
