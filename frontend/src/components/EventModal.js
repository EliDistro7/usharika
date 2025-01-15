import React from 'react';

const EventModal = ({ event, isOpen, onClose }) => {
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

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="eventModalLabel"
      aria-hidden="true"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
    >
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title" id="eventModalLabel">
              {event.title}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Modal Body */}
          <div className="modal-body text-black">
            <p>
              <strong>Kuanzia:</strong> {formatDate(event.start)}
            </p>
            <p>
              <strong>Kumaliza:</strong> {formatDate(event.end)}
            </p>
            {event.group && (
              <p>
                <strong>Kikundi:</strong> {event.group}
              </p>
            )}
          </div>

          {/* Modal Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Ondoa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
