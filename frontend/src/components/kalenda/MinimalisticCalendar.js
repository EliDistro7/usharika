import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Clock, Users, Download, MapPin } from 'lucide-react';

const MinimalistCalendar = ({ events, onEventClick, onDownload, viewType, dateRange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  // Add debugging
  useEffect(() => {
    console.log('MinimalistCalendar received events:', events);
    console.log('Events length:', events?.length || 0);
    if (events && events.length > 0) {
      console.log('First event:', events[0]);
      console.log('Event dates check:', events.map(event => ({
        title: event.title,
        start: event.start,
        startDate: new Date(event.start),
        dateString: new Date(event.start).toDateString()
      })));
    }
  }, [events]);

  // Ensure events is an array
  const safeEvents = events || [];

  // Group events by date for easy lookup
  const eventsByDate = safeEvents.reduce((acc, event) => {
    try {
      const dateKey = new Date(event.start).toDateString();
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(event);
    } catch (error) {
      console.error('Error processing event date:', event, error);
    }
    return acc;
  }, {});

  console.log('Events by date:', eventsByDate);

  // Get only dates that have events
  const busyDates = Object.keys(eventsByDate)
    .map(dateStr => new Date(dateStr))
    .filter(date => !isNaN(date.getTime())) // Filter out invalid dates
    .sort((a, b) => a - b);

  console.log('Busy dates:', busyDates);

  // Filter dates for current month view
  const getCurrentMonthBusyDates = () => {
    const filtered = busyDates.filter(date => 
      date.getMonth() === currentDate.getMonth() && 
      date.getFullYear() === currentDate.getFullYear()
    );
    console.log('Current month busy dates:', filtered);
    return filtered;
  };

  const formatTime = (date) => {
    try {
      return new Date(date).toLocaleTimeString('sw-TZ', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch (error) {
      console.error('Error formatting time:', date, error);
      return 'Invalid time';
    }
  };

  const formatDate = (date) => {
    try {
      return date.toLocaleDateString('sw-TZ', { 
        weekday: 'long', 
        day: 'numeric',
        month: 'long'
      });
    } catch (error) {
      console.error('Error formatting date:', date, error);
      return 'Invalid date';
    }
  };

  const getGroupColor = (group) => {
    const colors = {
      'Kwaya ya Umoja wa Vijana': '#8b5cf6',
      'Usharika': '#a855f7',
      'Kwaya ya Uinjilisti': '#c084fc'
    };
    return colors[group] || '#7c3aed';
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthNames = [
    'Januari', 'Februari', 'Machi', 'Aprili', 'Mei', 'Juni',
    'Julai', 'Agosti', 'Septemba', 'Oktoba', 'Novemba', 'Desemba'
  ];

  const currentMonthBusyDates = getCurrentMonthBusyDates();
  const isToday = (date) => date.toDateString() === new Date().toDateString();

  return (
    <div className="minimalist-calendar px-2 px-sm-3">
      <style jsx>{`
        .event-card {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(124, 58, 237, 0.15);
        }
        .date-badge {
          min-width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .date-badge.today {
          background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%);
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .event-time {
          background-color: rgba(124, 58, 237, 0.1);
          color: #7c3aed;
          font-weight: 600;
        }
        .group-indicator {
          width: 4px;
          height: 100%;
          border-radius: 2px;
        }
        
        /* Mobile-specific styles */
        @media (max-width: 576px) {
          .date-badge {
            min-width: 45px;
            height: 45px;
          }
          .minimalist-calendar {
            padding: 0 8px !important;
          }
          .mobile-header {
            padding: 8px 0;
          }
          .mobile-nav-btn {
            width: 36px !important;
            height: 36px !important;
            padding: 0 !important;
          }
          .mobile-download-btn {
            padding: 8px 12px !important;
            font-size: 0.85rem !important;
          }
          .mobile-month-title {
            font-size: 1.3rem !important;
            margin: 0 8px !important;
          }
          .mobile-event-card {
            margin-bottom: 12px;
            border-radius: 12px !important;
            box-shadow: 0 2px 8px rgba(124, 58, 237, 0.1) !important;
          }
          .mobile-event-item {
            padding: 12px !important;
            margin-bottom: 8px !important;
            border-radius: 8px !important;
            background-color: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
          }
          .mobile-legend {
            padding: 12px !important;
            margin-top: 16px !important;
          }
          .touch-target {
            min-height: 44px;
            display: flex;
            align-items: center;
          }
        }
        
        /* Better touch targets */
        .event-clickable {
          min-height: 44px;
          display: flex;
          align-items: center;
          padding: 8px 12px;
          border-radius: 8px;
          transition: background-color 0.2s ease;
        }
        .event-clickable:active {
          background-color: rgba(124, 58, 237, 0.05);
        }
      `}</style>

      {/* Debug info - remove after fixing */}
      <div className="d-none d-md-block" style={{padding: '10px', background: '#f9f9f9', margin: '10px 0', fontSize: '12px'}}>
        <strong>Debug:</strong> 
        Events: {safeEvents.length} | 
        Busy dates: {busyDates.length} | 
        Current month: {currentMonthBusyDates.length}
      </div>

      {/* Month Navigation - Mobile Optimized */}
      <div className="mobile-header d-flex justify-content-between align-items-center mb-3 mb-md-4 flex-wrap">
        <div className="d-flex align-items-center flex-grow-1">
          <button 
            className="btn btn-outline-purple mobile-nav-btn me-2 rounded-circle"
            onClick={() => navigateMonth(-1)}
            style={{width: '40px', height: '40px', padding: '0'}}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="btn btn-outline-purple mobile-nav-btn me-3 rounded-circle"
            onClick={() => navigateMonth(1)}
            style={{width: '40px', height: '40px', padding: '0'}}
          >
            <ChevronRight size={18} />
          </button>
          <h3 className="mobile-month-title mb-0 fw-bold flex-grow-1" style={{color: '#7c3aed'}}>
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>
        
        <button 
          className="btn btn-purple mobile-download-btn rounded-pill mt-2 mt-sm-0"
          onClick={onDownload}
        >
          <Download size={14} className="me-1" />
          <span className="d-none d-sm-inline">Download </span>Ratiba
        </button>
      </div>

      {/* Busy Days Display - Mobile Optimized */}
      {currentMonthBusyDates.length === 0 ? (
        <div className="text-center py-4 py-md-5">
          <Calendar size={40} className="text-muted mb-3" />
          <h5 className="text-muted">Hakuna shughuli za mwezi huu</h5>
          <p className="text-muted mb-2">Ratiba za shughuli zitaonekana hapa.</p>
          
          {/* Show total events for debugging */}
          <small className="text-info">
            (Total events loaded: {safeEvents.length})
          </small>
        </div>
      ) : (
        <div className="row g-2 g-md-3">
          {currentMonthBusyDates.map((date, index) => {
            const dayEvents = eventsByDate[date.toDateString()];
            
            return (
              <div key={index} className="col-12">
                <div className="mobile-event-card event-card card border-0 shadow-sm h-100">
                  <div className="card-body p-2 p-md-3">
                    <div className="d-flex align-items-start">
                      {/* Date Badge */}
                      <div className={`date-badge rounded-3 text-white d-flex flex-column align-items-center justify-content-center me-2 me-md-3 flex-shrink-0 ${isToday(date) ? 'today' : ''}`}>
                        <div className="fw-bold" style={{fontSize: '1.1rem'}}>
                          {date.getDate()}
                        </div>
                        <div style={{fontSize: '0.65rem', opacity: 0.9}}>
                          {date.toLocaleDateString('sw-TZ', { weekday: 'short' })}
                        </div>
                      </div>

                      {/* Events List */}
                      <div className="flex-grow-1 min-w-0">
                        <h6 className="fw-bold mb-2" style={{color: '#374151', fontSize: '0.95rem'}}>
                          {formatDate(date)}
                        </h6>
                        <div className="d-flex flex-column gap-2">
                          {dayEvents && dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex} className="w-100">
                              <div 
                                className="mobile-event-item event-clickable"
                                onClick={() => onEventClick && onEventClick(event)}
                              >
                                <div 
                                  className="group-indicator me-2 flex-shrink-0"
                                  style={{backgroundColor: getGroupColor(event.group)}}
                                ></div>
                                <div className="flex-grow-1 min-w-0">
                                  <div className="fw-medium mb-1" style={{fontSize: '0.85rem'}}>
                                    {event.title || 'No title'}
                                  </div>
                                  <div className="d-flex flex-column flex-sm-row gap-1">
                                    <div className="d-flex align-items-center">
                                      <Clock size={11} className="me-1 text-muted flex-shrink-0" />
                                      <span className="event-time px-2 py-1 rounded-pill" style={{fontSize: '0.7rem'}}>
                                        {formatTime(event.start)} - {formatTime(event.end)}
                                      </span>
                                    </div>
                                    <div className="d-flex align-items-center">
                                      <Users size={11} className="me-1 text-muted flex-shrink-0" />
                                      <span className="text-muted text-truncate" style={{fontSize: '0.7rem'}}>
                                        {event.group || 'No group'}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legend - Mobile Optimized */}
      <div className="mobile-legend mt-3 mt-md-4 p-2 p-md-3 bg-light rounded-3">
        <h6 className="fw-bold mb-2 mb-md-3" style={{color: '#374151', fontSize: '0.9rem'}}>Vikundi</h6>
        <div className="d-flex flex-column flex-md-row gap-2">
          {['Kwaya ya Umoja wa Vijana', 'Usharika', 'Kwaya ya Uinjilisti'].map((group, index) => (
            <div key={index} className="d-flex align-items-center touch-target">
              <div 
                className="rounded-circle me-2 flex-shrink-0" 
                style={{
                  width: '10px', 
                  height: '10px', 
                  backgroundColor: getGroupColor(group)
                }}
              ></div>
              <span className="fw-medium" style={{fontSize: '0.8rem'}}>{group}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        .btn-purple {
          background-color: #7c3aed;
          border-color: #7c3aed;
          color: white;
        }
        .btn-purple:hover {
          background-color: #6d28d9;
          border-color: #6d28d9;
          color: white;
        }
        .btn-outline-purple {
          border-color: #7c3aed;
          color: #7c3aed;
          background-color: transparent;
        }
        .btn-outline-purple:hover {
          background-color: #7c3aed;
          border-color: #7c3aed;
          color: white;
        }
        
        /* Mobile-specific global styles */
        @media (max-width: 576px) {
          .btn-purple:active,
          .btn-outline-purple:active {
            transform: scale(0.95);
          }
        }
      `}</style>
    </div>
  );
};

export default MinimalistCalendar;