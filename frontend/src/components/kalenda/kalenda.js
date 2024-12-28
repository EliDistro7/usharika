'use client';

import React, { useState, useEffect } from 'react';
import { initializeCalendar } from '@/hooks/initializeCalendar';
import EventModal from '@/components/EventModal'; // Optional: if you plan to add event modals
import SnowyTree from '../xmass/SnowyTree';
import {CountdownDisplay} from '../xmass/Countdown';



const Calendar = () => {
  const [selectedEvent, setSelectedEvent] = useState(null); // For event details
  const [modalOpen, setModalOpen] = useState(false); // For event modal visibility

  useEffect(() => {
    // Initialize the calendar with callbacks for event handling
    initializeCalendar(setSelectedEvent, toggleModal);
  }, [selectedEvent,modalOpen]);

  const toggleModal =()=>{
    setModalOpen(!modalOpen);
  }

  return (
    <div>
      {/* Section Wrapper */}
      <section className="owl py-5 ">
       
        <CountdownDisplay
        targetDate="2024-12-25T00:00:00Z"
        eventName="Christmas"
        backgroundImage="https://images.pexels.com/photos/1303098/pexels-photo-1303098.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
      />
     
        
        <div className="container text-center">
          {/* Heading */}
          <h2 className="display-5 fw-bold text-primary mb-4">Kalenda Yetu</h2>
          <p className="lead text-muted mb-5">
            Pitia kalenda ya usharika wetu kufahamu matukio yajayo
          </p>

          {/* Calendar Container */}
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
