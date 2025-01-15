'use client';

import React, { useState, useEffect } from 'react';
import { initializeCalendar } from '@/hooks/initializeCalendar';
import { generateTimetable } from '@/hooks/generateTimetable';
import EventModal from '@/components/EventModal';
import SlideCarousel from '@/components/SlideCarousel';
import { CountdownDisplay } from '@/components/xmass/Countdown';

const Calendar = () => {
    const [selectedEvent, setSelectedEvent] = useState(null); // For event details
    const [modalOpen, setModalOpen] = useState(false); // For event modal visibility
    const [showDownload, setShowDownload] = useState(false); // For showing the download button
    const [fullEvents, setFullEvents] = useState([]); // Store the events
    const [isClient, setIsClient] = useState(false); // Track client rendering
    const [viewType, setViewType] = useState('dayGridMonth'); // Default view type
    const [dateRange, setDateRange] = useState(''); // Store the date range

    useEffect(() => {
        setIsClient(true); // Indicates that the component is rendering on the client
    }, []);

    useEffect(() => {
        if (isClient) {
            initializeCalendar(setSelectedEvent, toggleModal, setFullEvents, (view) => {
                setViewType(view); // Update view type
                updateDateRange(view); // Update date range dynamically
            });
            setShowDownload(true);
        }
    }, [isClient]);

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
        return null; // Render nothing on the server to avoid mismatch
    }

    return (
        <div>
            <section className="owl pt-0">
                <div className="container text-center px-0">
                    <SlideCarousel>
                        <div>
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

                <div className="container text-center mt-5">
                    <div id="calendar" className="rounded shadow-sm p-4 px-0 mx-0">
                        {/* Calendar will render here */}
                    </div>
                    {showDownload && (
    <button
        onClick={() => generateTimetable(fullEvents, viewType, dateRange)}
        className="btn btn-primary ms-auto px-4 py-2 rounded-3 mt-8 shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200"
    >
        Download Ratiba
    </button>
)}
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
