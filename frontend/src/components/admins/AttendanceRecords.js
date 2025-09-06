import React, { useEffect, useState } from 'react';
import { getAttendanceByGroup } from '@/actions/attendance';
import { 
  FaChevronDown, 
  FaChevronUp, 
  FaDownload, 
  FaUsers, 
  FaCalendarAlt,
  FaEye,
  FaEyeSlash,
  FaFileAlt,
  FaUserCheck
} from 'react-icons/fa';
import jsPDF from 'jspdf';

const AttendanceRecords = ({ group }) => {
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedRecordIndex, setExpandedRecordIndex] = useState(null);
  const [attendeesToShow, setAttendeesToShow] = useState(5);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      try {
        setLoading(true);
        setError('');
        const records = await getAttendanceByGroup(group);
        setAttendanceRecords(records);
      } catch (err) {
        setError('Failed to fetch attendance records. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (group) {
      fetchAttendanceRecords();
    }
  }, [group]);

  const toggleAttendees = (index) => {
    setExpandedRecordIndex(expandedRecordIndex === index ? null : index);
    setAttendeesToShow(5); // Reset to show 5 when toggling
  };

  const handleDownloadPDF = (record) => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Rekodi za Mahudhurio', 105, 20, { align: 'center' });

    // Session details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(`Kipindi: ${record.session_name}`, 20, 40);
    doc.text(`Tarehe: ${new Date(record.date).toLocaleDateString('sw-TZ')}`, 20, 50);
    doc.text(`Jumla ya Waliohudhuria: ${record.attendees.length}`, 20, 60);

    // Attendees list
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Orodha ya Waliohudhuria:', 20, 80);

    let yPosition = 90;
    record.attendees.forEach((attendee, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.setFont('helvetica', 'normal');
      doc.text(`${index + 1}. ${attendee.name} (ID: ${attendee.id})`, 20, yPosition);
      yPosition += 8;
    });

    // Footer
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(107, 70, 193);
    doc.text(
      `Imetokana na Mfumo wa Usharika wa Yombo - ${new Date().toLocaleDateString('sw-TZ')}`,
      105,
      pageHeight - 10,
      { align: 'center' }
    );

    doc.save(`mahudhurio-${record.session_name}-${new Date(record.date).toLocaleDateString('sw-TZ')}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-300 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mx-auto mb-4"></div>
          <p className="text-text-secondary font-medium">Inapakia rekodi za mahudhurio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-300 flex items-center justify-center px-4">
        <div className="bg-error-50 border border-error-200 rounded-2xl p-6 max-w-md w-full text-center">
          <div className="text-error-500 text-2xl mb-4">⚠️</div>
          <p className="text-error-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-300">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full mb-4 animate-gentle-float">
            <FaUsers className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary mb-4">
            Rekodi za Mahudhurio
          </h1>
          <p className="text-text-secondary text-lg">
            Tazama na pakua rekodi zote za mahudhurio ya kikundi chako
          </p>
        </div>

        {/* Main Content */}
        {attendanceRecords.length > 0 ? (
          <div className="space-y-6 animate-slide-up">
            {attendanceRecords.map((record, index) => (
              <div
                key={index}
                className="glass backdrop-blur-xl rounded-3xl shadow-strong overflow-hidden transition-all duration-300 hover:shadow-primary"
              >
                {/* Record Header */}
                <div className="bg-primary-gradient px-6 py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    {/* Session Info */}
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {index + 1}
                          </span>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white text-shadow">
                          {record.session_name}
                        </h3>
                        <div className="flex items-center space-x-4 text-primary-100 text-sm mt-1">
                          <div className="flex items-center space-x-1">
                            <FaCalendarAlt />
                            <span>{new Date(record.date).toLocaleDateString('sw-TZ')}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <FaUserCheck />
                            <span>{record.attendees.length} waliohudhuria</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => toggleAttendees(index)}
                        className="
                          px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl
                          font-medium transition-all duration-300 flex items-center space-x-2
                          backdrop-blur-sm hover:scale-105
                        "
                      >
                        {expandedRecordIndex === index ? <FaEyeSlash /> : <FaEye />}
                        <span>{expandedRecordIndex === index ? 'Ficha' : 'Ona'}</span>
                        {expandedRecordIndex === index ? <FaChevronUp /> : <FaChevronDown />}
                      </button>

                      <button
                        onClick={() => handleDownloadPDF(record)}
                        className="
                          btn-secondary px-4 py-2 rounded-xl text-white font-medium
                          flex items-center space-x-2 transition-all duration-300
                          shadow-yellow hover:shadow-yellow-lg hover:scale-105
                        "
                      >
                        <FaDownload />
                        <span>Pakua PDF</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expandable Attendees Section */}
                {expandedRecordIndex === index && (
                  <div className="bg-white/90 backdrop-blur-sm p-6 animate-slide-down">
                    <div className="flex items-center space-x-2 mb-4">
                      <FaFileAlt className="text-primary-500" />
                      <h4 className="font-bold text-text-primary text-lg">
                        Orodha ya Waliohudhuria
                      </h4>
                    </div>

                    {/* Attendees Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {record.attendees.slice(0, attendeesToShow).map((attendee, i) => (
                        <div
                          key={i}
                          className="
                            flex items-center justify-between p-4 rounded-2xl border-2 border-border-light
                            hover:border-primary-300 hover:bg-primary-50/50 transition-all duration-300
                            bg-background-50 group
                          "
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                              <span className="text-primary-700 font-bold text-sm">
                                {i + 1}
                              </span>
                            </div>
                            <span className="font-medium text-text-primary group-hover:text-primary-700">
                              {attendee.name}
                            </span>
                          </div>
                          <span className="
                            px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-xs font-medium
                            group-hover:bg-primary-200 transition-colors
                          ">
                            ID: {attendee.id}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Load More Button */}
                    {record.attendees.length > attendeesToShow && (
                      <div className="text-center mt-6">
                        <button
                          onClick={() => setAttendeesToShow(attendeesToShow + 5)}
                          className="
                            btn-primary px-6 py-3 rounded-2xl text-white font-medium
                            shadow-primary hover:shadow-primary-lg transition-all duration-300
                            flex items-center space-x-2 mx-auto
                          "
                        >
                          <span>Tazama zaidi ({record.attendees.length - attendeesToShow} wamebaki)</span>
                          <FaChevronDown />
                        </button>
                      </div>
                    )}

                    {/* Statistics */}
                    <div className="mt-6 p-4 bg-background-200 rounded-2xl border border-border-light">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-primary-600">
                            {record.attendees.length}
                          </div>
                          <p className="text-text-secondary text-sm font-medium">
                            Jumla ya Wahudhuriaji
                          </p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {new Date(record.date).toLocaleDateString('sw-TZ', { weekday: 'long' })}
                          </div>
                          <p className="text-text-secondary text-sm font-medium">
                            Siku ya Wiki
                          </p>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-yellow-600">
                            {new Date(record.date).toLocaleDateString('sw-TZ', { month: 'long' })}
                          </div>
                          <p className="text-text-secondary text-sm font-medium">
                            Mwezi
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="glass backdrop-blur-xl rounded-3xl shadow-strong overflow-hidden">
            <div className="px-8 py-16 text-center">
              <div className="text-6xl mb-6 opacity-50">📋</div>
              <h3 className="text-2xl font-bold text-text-primary mb-4">
                Hakuna Rekodi za Mahudhurio
              </h3>
              <p className="text-text-secondary max-w-md mx-auto">
                Bado hakuna rekodi za mahudhurio zilizorekodiwa kwa kikundi hiki. 
                Rekodi zitaonekana hapa baada ya kusajili mahudhurio ya kwanza.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceRecords;