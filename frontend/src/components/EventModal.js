import React, { useEffect } from 'react';
import { X, Calendar, Clock, Users } from 'lucide-react';

const EventModal = ({ event, isOpen, onClose }) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !event) return null;

  // Helper function to format the date in Swahili
  const formatDate = (date) => {
    return new Date(date).toLocaleString('sw-TZ', {
      weekday: 'long', // e.g., "Jumatatu"
      year: 'numeric',
      month: 'long', // e.g., "Novemba"
      day: 'numeric',
      hour: '2-digit', // e.g., "10"
      minute: '2-digit', // e.g., "30"
      hour12: true, // 12-hour format
    });
  };

  // Get group color
  const getGroupColor = (group) => {
    const colors = {
      'Kwaya ya Umoja wa Vijana': {
        bg: 'from-purple-500 to-purple-600',
        text: 'text-purple-700',
        badge: 'bg-purple-100 text-purple-700 border-purple-200'
      },
      'Usharika': {
        bg: 'from-primary-500 to-primary-600',
        text: 'text-primary-700',
        badge: 'bg-primary-100 text-primary-700 border-primary-200'
      },
      'Kwaya ya Uinjilisti': {
        bg: 'from-yellow-500 to-yellow-600',
        text: 'text-yellow-700',
        badge: 'bg-yellow-100 text-yellow-700 border-yellow-200'
      }
    };
    return colors[group] || {
      bg: 'from-primary-500 to-primary-600',
      text: 'text-primary-700',
      badge: 'bg-primary-100 text-primary-700 border-primary-200'
    };
  };

  const groupColors = getGroupColor(event.group);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        className="fixed inset-0 z-50 overflow-y-auto"
        role="dialog"
        aria-labelledby="eventModalLabel"
        aria-modal="true"
      >
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <div
            className="relative transform overflow-hidden rounded-3xl bg-white shadow-strong transition-all duration-300 sm:my-8 sm:w-full sm:max-w-lg animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Decorative Header Background */}
            <div className={`absolute top-0 left-0 right-0 h-32 bg-gradient-to-br ${groupColors.bg} opacity-10`} />
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-bl from-white/20 to-transparent rounded-full" />
            <div className="absolute top-8 left-6 w-12 h-12 bg-gradient-to-tr from-white/15 to-transparent rounded-full" />

            {/* Modal Header */}
            <div className="relative px-6 pt-6 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  {/* Event Title */}
                  <h3
                    id="eventModalLabel"
                    className="text-xl sm:text-2xl font-bold text-text-primary leading-tight font-display mb-2"
                  >
                    {event.title}
                  </h3>
                  
                  {/* Group Badge */}
                  {event.group && (
                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${groupColors.badge} text-sm font-semibold`}>
                      <Users size={14} />
                      {event.group}
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  type="button"
                  className="flex-shrink-0 rounded-full p-2 text-text-tertiary hover:text-text-primary hover:bg-background-200 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <div className="space-y-4">
                {/* Start Date */}
                <div className="flex items-start gap-4 p-4 bg-background-100 rounded-2xl border border-border-light">
                  <div className="flex-shrink-0 w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                    <Calendar size={18} className="text-success-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-secondary mb-1">
                      Kuanzia
                    </p>
                    <p className="text-text-primary font-medium break-words">
                      {formatDate(event.start)}
                    </p>
                  </div>
                </div>

                {/* End Date */}
                <div className="flex items-start gap-4 p-4 bg-background-100 rounded-2xl border border-border-light">
                  <div className="flex-shrink-0 w-10 h-10 bg-error-100 rounded-xl flex items-center justify-center">
                    <Clock size={18} className="text-error-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-text-secondary mb-1">
                      Kumaliza
                    </p>
                    <p className="text-text-primary font-medium break-words">
                      {formatDate(event.end)}
                    </p>
                  </div>
                </div>

                {/* Duration Calculation */}
                <div className="p-4 bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl border border-primary-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary-200 rounded-lg flex items-center justify-center">
                      <Clock size={14} className="text-primary-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-primary-700">
                        Muda wa Tukio
                      </p>
                      <p className="text-xs text-primary-600">
                        {(() => {
                          const start = new Date(event.start);
                          const end = new Date(event.end);
                          const durationMs = end - start;
                          const hours = Math.floor(durationMs / (1000 * 60 * 60));
                          const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
                          
                          if (hours === 0) return `${minutes} dakika`;
                          if (minutes === 0) return `${hours} saa`;
                          return `${hours} saa na ${minutes} dakika`;
                        })()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-background-50 rounded-b-3xl">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-text-tertiary to-text-secondary text-white font-semibold rounded-2xl hover:from-text-secondary hover:to-text-primary transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-text-secondary focus:ring-offset-2 shadow-soft hover:shadow-medium hover:-translate-y-0.5"
                  onClick={onClose}
                >
                  <X size={16} />
                  Ondoa
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-tl from-primary-100/50 to-transparent rounded-full pointer-events-none" />
            <div className="absolute -top-1 -left-1 w-8 h-8 bg-gradient-to-br from-yellow-100/60 to-transparent rounded-full pointer-events-none" />
          </div>
        </div>
      </div>
    </>
  );
};

export default EventModal;