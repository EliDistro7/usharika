'use client';

import React, { useState, useEffect } from 'react';
import { initializeCalendar } from '@/hooks/initializeCalendar';
import EventModal from '@/components/EventModal'; // Optional: if you plan to add event modals
import SlideCarousel from '@/components/SlideCarousel'; // Import the SlideCarousel component
import { CountdownDisplay } from '@/components/xmass/CountDown';

const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null); // For event details
  const [modalOpen, setModalOpen] = useState(false); // For event modal visibility

  useEffect(() => {
    // Initialize the calendar with callbacks for event handling
    initializeCalendar(setSelectedEvent, toggleModal);
  }, [selectedEvent, modalOpen]);

  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  return (
    <div>
      {/* Section Wrapper */}
      <section className="owl pt-0">
        <div className="container text-center px-0">
          
          {/* SlideCarousel for Countdown Displays */}
          <SlideCarousel>
            <div >
              <CountdownDisplay
                targetDate="2025-01-30T00:00:00Z"
                eventName="Ibada ya Mkesha"
                backgroundImage="/img/worship1.jpg"
              />
            </div>
            <div>
              <CountdownDisplay
                targetDate="2025-02-14T00:00:00Z"
                eventName="Maombi ya Vijana"
                backgroundImage="/img/cross.jpeg"
                
              />
            </div>
            <div>
              <CountdownDisplay
                targetDate="2025-03-25T00:00:00Z"
                eventName="Tamasha la Muziki"
                backgroundVideo="https://res.cloudinary.com/df9gkjxm8/video/upload/v1736323913/profile/yghwfekbdmjtou9kbv97.mp4"

              />
            </div>
          </SlideCarousel>
        </div>

        {/* Calendar Container */}
        <div className="container text-center mt-5">
          <div id="calendar" className="rounded shadow-sm p-4 px-0 mx-0">
            {/* Calendar will render here */}
          </div>
        </div>
      </section>

      {/* Event Modal (Optional) */}
      {selectedEvent && (
        <EventModal
          event={selectedEvent}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Calendar;
