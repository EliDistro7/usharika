import React, { useState, useEffect } from 'react';
import { getAttendanceById } from '@/actions/attendance';
import generateCertificate from "@/utils/generateCertificate";
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  FaTimes, 
  FaDownload, 
  FaUsers, 
  FaCalendarAlt, 
  FaStar, 
  FaUserCheck,
  FaFileAlt,
  FaSpinner
} from 'react-icons/fa';

const AttendanceModal = ({ attendanceId, showModal, handleClose }) => {
  const [attendance, setAttendance] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch the attendance record by ID when the modal opens
  useEffect(() => {
    if (attendanceId && showModal) {
      const fetchAttendance = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await getAttendanceById(attendanceId);
          setAttendance(data);
        } catch (err) {
          setError('Imeshindwa kupakia rekodi ya mahudhurio.');
          console.error('Error fetching attendance:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchAttendance();
    }
  }, [attendanceId, showModal]);

  const handleDownloadPDF = () => {
    if (!attendance) {
      return;
    }

    const doc = new jsPDF({ compress: true });

    // Format Group Name
    const formattedGroup = attendance.group
      ? attendance.group.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
      : 'Hakijabainishwa';

    // Get Current Date and Time
    const currentDate = new Date();

    // Add Header Section with Purple Theme
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(107, 70, 193); // Your custom primary color
    doc.setFontSize(20);
    doc.text('KKKT USHARIKA WA YOMBO', 105, 15, { align: 'center' });

    doc.setFontSize(16);
    doc.text('Rekodi ya Mahudhurio', 105, 25, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Kikundi: ${formattedGroup}`, 14, 40);
    doc.text(`Kipindi: ${attendance.session_name}`, 14, 50);
    doc.text(`Tarehe: ${new Date(attendance.date).toLocaleDateString('sw-TZ')}`, 14, 60);

    // Add Attendees Table with Ratings
    const headers = ['#', 'Jina la Mshiriki', 'Alama za Umahiri'];
    const body = attendance.attendees.map((attendee, index) => [
      index + 1,
      attendee.name,
      attendee.cumulativeRating || 'Hajapatikani',
    ]);

    doc.autoTable({
      head: [headers],
      body: body,
      startY: 70,
      theme: 'grid',
      headStyles: {
        fillColor: [107, 70, 193], // Your custom primary color
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 10,
        cellPadding: 4,
      },
      alternateRowStyles: {
        fillColor: [240, 230, 250], // Light purple
      },
      columnStyles: {
        0: { cellWidth: 15, halign: 'center' },
        1: { cellWidth: 80 },
        2: { cellWidth: 40, halign: 'center' }
      }
    });

    // Add Statistics Section
    const finalY = doc.lastAutoTable.finalY + 20;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Takwimu:', 14, finalY);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`• Jumla ya Wahudhuriaji: ${attendance.attendees.length}`, 14, finalY + 10);
    
    const totalRating = attendance.attendees.reduce((sum, attendee) => 
      sum + (attendee.cumulativeRating || 0), 0);
    const averageRating = attendance.attendees.length > 0 ? 
      (totalRating / attendance.attendees.length).toFixed(1) : 'N/A';
    
    doc.text(`• Wastani wa Alama: ${averageRating}`, 14, finalY + 20);
    doc.text(`• Tarehe ya Kutayarishwa: ${currentDate.toLocaleDateString('sw-TZ')}`, 14, finalY + 30);

    // Add Footer Section
    const pageHeight = doc.internal.pageSize.height;
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(107, 70, 193);
    doc.text('Imetokana na Mfumo wa Usharika wa Yombo', 105, pageHeight - 10, { align: 'center' });

    // Save the PDF with a filename
    const sanitizedGroupName = formattedGroup.replace(/[^\w-]/g, '_');
    const sessionName = attendance.session_name.replace(/[^\w-]/g, '_');
    doc.save(`${sanitizedGroupName}_${sessionName}_mahudhurio.pdf`);
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="glass backdrop-blur-2xl rounded-3xl shadow-strong max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Modal Header */}
        <div className="bg-primary-gradient px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FaFileAlt className="text-white text-lg" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-white text-shadow">
                {loading ? 'Inapakia...' : attendance?.session_name || 'Rekodi ya Mahudhurio'}
              </h2>
              {attendance && (
                <p className="text-primary-100 text-sm">
                  {new Date(attendance.date).toLocaleDateString('sw-TZ', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            className="
              w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center
              text-white transition-all duration-300 hover:scale-110
            "
          >
            <FaTimes />
          </button>
        </div>

        {/* Modal Body */}
        <div className="bg-white/90 backdrop-blur-sm max-h-[60vh] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <FaSpinner className="animate-spin text-primary-500 text-4xl mb-4 mx-auto" />
                <p className="text-text-secondary font-medium">Inapakia rekodi...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <div className="bg-error-50 border border-error-200 rounded-2xl p-6">
                <div className="text-error-500 text-2xl mb-4">⚠️</div>
                <p className="text-error-700 font-medium">{error}</p>
              </div>
            </div>
          ) : attendance ? (
            <div className="p-6">
              {/* Session Info Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-background-100 p-4 rounded-2xl border border-border-light text-center">
                  <FaUsers className="text-primary-500 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text-primary">
                    {attendance.attendees.length}
                  </div>
                  <p className="text-text-secondary text-sm font-medium">Waliohudhuria</p>
                </div>

                <div className="bg-background-100 p-4 rounded-2xl border border-border-light text-center">
                  <FaStar className="text-yellow-500 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text-primary">
                    {attendance.attendees.length > 0 
                      ? (attendance.attendees.reduce((sum, att) => sum + (att.cumulativeRating || 0), 0) / attendance.attendees.length).toFixed(1)
                      : '0'}
                  </div>
                  <p className="text-text-secondary text-sm font-medium">Wastani wa Alama</p>
                </div>

                <div className="bg-background-100 p-4 rounded-2xl border border-border-light text-center">
                  <FaCalendarAlt className="text-green-500 text-2xl mx-auto mb-2" />
                  <div className="text-2xl font-bold text-text-primary">
                    {new Date(attendance.date).toLocaleDateString('sw-TZ', { day: 'numeric' })}
                  </div>
                  <p className="text-text-secondary text-sm font-medium">
                    {new Date(attendance.date).toLocaleDateString('sw-TZ', { month: 'long' })}
                  </p>
                </div>
              </div>

              {/* Group Info */}
              <div className="bg-primary-50 p-4 rounded-2xl border border-primary-200 mb-6">
                <div className="flex items-center space-x-2">
                  <FaUserCheck className="text-primary-600" />
                  <span className="font-semibold text-primary-800">Kikundi:</span>
                  <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {attendance.group?.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase()) || 'Hakijabainishwa'}
                  </span>
                </div>
              </div>

              {/* Attendees List */}
              <div>
                <h3 className="flex items-center space-x-2 font-bold text-text-primary text-lg mb-4">
                  <FaUsers className="text-primary-500" />
                  <span>Orodha ya Waliohudhuria</span>
                </h3>

                <div className="space-y-3">
                  {attendance.attendees.map((attendee, index) => (
                    <div
                      key={attendee.userId}
                      className="
                        flex items-center justify-between p-4 rounded-2xl border-2 border-border-light
                        hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-300
                        bg-background-50 group
                      "
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-700 font-bold">
                            {index + 1}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-text-primary group-hover:text-primary-700 transition-colors">
                            {attendee.name}
                          </h4>
                          <p className="text-text-secondary text-sm">
                            ID: {attendee.userId}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className={`
                          px-3 py-1 rounded-full text-sm font-bold
                          ${attendee.cumulativeRating 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-600'
                          }
                        `}>
                          {attendee.cumulativeRating ? `${attendee.cumulativeRating} alama` : 'Hakuna alama'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        {attendance && !loading && !error && (
          <div className="bg-background-100 px-6 py-4 border-t border-border-light flex justify-end">
            <button
              onClick={handleDownloadPDF}
              className="
                btn-secondary px-6 py-3 rounded-2xl text-white font-bold text-sm
                flex items-center space-x-3 transition-all duration-300
                shadow-yellow-lg hover:shadow-yellow-lg hover:scale-105
              "
            >
              <FaDownload className="text-lg" />
              <span>Pakua PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceModal;