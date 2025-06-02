'use client';

import React, { useState, useEffect } from 'react';
import { initializeCalendar } from '@/hooks/initializeCalendar';
import { generateTimetable } from '@/hooks/generateTimetable';
import EventModal from '@/components/EventModal';
import SlideCarousel from '@/components/SlideCarousel';
import { CountdownDisplay } from '@/components/xmass/CountDown';
import UserCards from "@/components/kalenda/UserCards";
import MinimalistCalendar from '@/components/kalenda/MinimalisticCalendar';


// Add this debugging code to your Calendar component to see what's happening

const Calendar = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const [fullEvents, setFullEvents] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [viewType, setViewType] = useState('dayGridMonth');
    const [dateRange, setDateRange] = useState('');

    // Add debugging useEffect
    useEffect(() => {
        console.log('fullEvents updated:', fullEvents);
        console.log('Number of events:', fullEvents.length);
        if (fullEvents.length > 0) {
            console.log('Sample event:', fullEvents[0]);
            console.log('Event structure check:', {
                hasStart: !!fullEvents[0].start,
                hasEnd: !!fullEvents[0].end,
                hasTitle: !!fullEvents[0].title,
                hasGroup: !!fullEvents[0].group,
                startValue: fullEvents[0].start,
                startType: typeof fullEvents[0].start
            });
        }
    }, [fullEvents]);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (isClient) {
            console.log('Initializing calendar...');
            initializeCalendar(setSelectedEvent, toggleModal, setFullEvents, (view) => {
                setViewType(view);
                updateDateRange(view);
            });
            setShowDownload(true);
        }
    }, [isClient]);

    // Rest of your component...
    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };

    const updateDateRange = (view) => {
        const today = new Date();
        let startDate, endDate;

        if (view === 'dayGridMonth') {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        } else if (view === 'timeGridWeek') {
            const day = today.getDay();
            startDate = new Date(today);
            startDate.setDate(today.getDate() - day);
            endDate = new Date(today);
            endDate.setDate(today.getDate() + (6 - day));
        } else if (view === 'timeGridDay') {
            startDate = new Date(today);
            endDate = new Date(today);
        }

        setDateRange(`${startDate.toDateString()} - ${endDate.toDateString()}`);
    };

    if (!isClient) {
        return null;
    }

    return (
        <div>
            {/* Add a debug section - remove this after fixing */}
            <div style={{padding: '10px', background: '#f0f0f0', margin: '10px 0'}}>
                <h6>Debug Info:</h6>
                <p>Events loaded: {fullEvents.length}</p>
                <p>Is client: {isClient.toString()}</p>
                <p>View type: {viewType}</p>
                {fullEvents.length > 0 && (
                    <details>
                        <summary>Show events data</summary>
                        <pre>{JSON.stringify(fullEvents.slice(0, 2), null, 2)}</pre>
                    </details>
                )}
            </div>

            <section className="owl pt-0 mb-8">
                {/* Your existing content */}
                <div className="container text-center px-0">
                    {/* SlideCarousel content */}
                </div>

                <div className="container text-center mt-5">
                    <UserCards />
                </div>

                <div className="container text-center mt-5 mb-5">
                    <h2
                        className="text-center fw-bold mb-4"
                        style={{
                            fontSize: "2rem",
                            color: "#6a0dad",
                            textShadow: "2px 2px 4px rgba(106, 13, 173, 0.3)",
                        }}
                    >
                        Ratiba za Mwezi za Usharika na Vikundi
                    </h2>
                    
                    <MinimalistCalendar 
                        events={fullEvents}
                        onEventClick={setSelectedEvent} // Make sure this prop is passed
                        onDownload={() => generateTimetable(fullEvents, viewType, dateRange)}
                        viewType={viewType}
                        dateRange={dateRange}
                    />
                </div>
            </section>

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
