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
    <div className="px-2 sm:px-4 lg:px-6">
      {/* Debug info - remove after fixing */}
      <div className="hidden md:block p-3 bg-background-200 rounded-lg my-4 text-xs text-text-secondary">
        <strong className="text-text-primary">Debug:</strong> 
        Events: {safeEvents.length} | 
        Busy dates: {busyDates.length} | 
        Current month: {currentMonthBusyDates.length}
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center mb-4 md:mb-6 flex-wrap gap-4">
        <div className="flex items-center flex-grow">
          <button 
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5 mr-2"
            onClick={() => navigateMonth(-1)}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200 hover:-translate-y-0.5 mr-4"
            onClick={() => navigateMonth(1)}
          >
            <ChevronRight size={18} />
          </button>
          <h3 className="text-xl md:text-2xl font-bold text-primary-700 flex-grow">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
        </div>
        
        <button 
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold rounded-full hover:from-primary-700 hover:to-primary-800 transition-all duration-200 hover:-translate-y-0.5 shadow-primary text-sm md:text-base"
          onClick={onDownload}
        >
          <Download size={14} className="mr-2" />
          <span className="hidden sm:inline">Download </span>Ratiba
        </button>
      </div>

      {/* Busy Days Display */}
      {currentMonthBusyDates.length === 0 ? (
        <div className="text-center py-8 md:py-12">
          <Calendar size={40} className="text-text-tertiary mb-4 mx-auto" />
          <h5 className="text-lg font-semibold text-text-secondary mb-2">Hakuna shughuli za mwezi huu</h5>
          <p className="text-text-tertiary mb-4">Ratiba za shughuli zitaonekana hapa.</p>
          
          {/* Show total events for debugging */}
          <small className="text-primary-500">
            (Total events loaded: {safeEvents.length})
          </small>
        </div>
      ) : (
        <div className="space-y-3 md:space-y-4">
          {currentMonthBusyDates.map((date, index) => {
            const dayEvents = eventsByDate[date.toDateString()];
            
            return (
              <div key={index} className="group">
                <div className="bg-white rounded-2xl border border-border-light hover:border-border-accent shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                  <div className="p-4 md:p-6">
                    <div className="flex items-start gap-4">
                      {/* Date Badge */}
                      <div className={`flex-shrink-0 min-w-[50px] h-[50px] md:min-w-[60px] md:h-[60px] rounded-2xl bg-gradient-to-br ${
                        isToday(date) 
                          ? 'from-primary-600 to-primary-700 animate-pulse-soft' 
                          : 'from-primary-500 to-purple-600'
                      } text-white flex flex-col items-center justify-center shadow-primary`}>
                        <div className="font-bold text-lg md:text-xl">
                          {date.getDate()}
                        </div>
                        <div className="text-xs opacity-90">
                          {date.toLocaleDateString('sw-TZ', { weekday: 'short' })}
                        </div>
                      </div>

                      {/* Events List */}
                      <div className="flex-grow min-w-0">
                        <h6 className="font-bold text-text-primary mb-3 text-base md:text-lg">
                          {formatDate(date)}
                        </h6>
                        <div className="space-y-2">
                          {dayEvents && dayEvents.map((event, eventIndex) => (
                            <div key={eventIndex} className="w-full">
                              <div 
                                className="flex items-center p-3 md:p-4 bg-background-100 hover:bg-background-200 rounded-xl border border-border-light hover:border-border-accent transition-all duration-200 cursor-pointer group/event min-h-[44px]"
                                onClick={() => onEventClick && onEventClick(event)}
                              >
                                <div 
                                  className="w-1 h-12 md:h-14 rounded-full mr-3 flex-shrink-0"
                                  style={{backgroundColor: getGroupColor(event.group)}}
                                ></div>
                                <div className="flex-grow min-w-0">
                                  <div className="font-semibold text-text-primary mb-2 text-sm md:text-base group-hover/event:text-primary-700 transition-colors">
                                    {event.title || 'No title'}
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                                    <div className="flex items-center">
                                      <Clock size={12} className="mr-2 text-text-tertiary flex-shrink-0" />
                                      <span className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-xs font-semibold">
                                        {formatTime(event.start)} - {formatTime(event.end)}
                                      </span>
                                    </div>
                                    <div className="flex items-center">
                                      <Users size={12} className="mr-2 text-text-tertiary flex-shrink-0" />
                                      <span className="text-text-secondary text-xs md:text-sm truncate">
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

      {/* Legend */}
      <div className="mt-6 md:mt-8 p-4 md:p-6 bg-background-100 rounded-2xl border border-border-light">
        <h6 className="font-bold text-text-primary mb-4 text-sm md:text-base">Vikundi</h6>
        <div className="flex flex-col md:flex-row gap-3 md:gap-6">
          {['Kwaya ya Umoja wa Vijana', 'Usharika', 'Kwaya ya Uinjilisti'].map((group, index) => (
            <div key={index} className="flex items-center min-h-[44px] md:min-h-0">
              <div 
                className="w-3 h-3 rounded-full mr-3 flex-shrink-0" 
                style={{backgroundColor: getGroupColor(group)}}
              ></div>
              <span className="font-medium text-text-secondary text-sm md:text-base">{group}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MinimalistCalendar;