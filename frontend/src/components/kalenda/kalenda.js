'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Download, Eye, Grid, List, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { initializeCalendar } from '@/hooks/initializeCalendar';
import { generateTimetable } from '@/hooks/generateTimetable';
import EventModal from '@/components/EventModal';
import SlideCarousel from '@/components/SlideCarousel';
import { CountdownDisplay } from '@/components/xmass/CountDown';
import UserCards from "@/components/kalenda/UserCards";
import MinimalistCalendar from '@/components/kalenda/MinimalisticCalendar';

const Calendar2 = () => {
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [showDownload, setShowDownload] = useState(false);
    const [fullEvents, setFullEvents] = useState([]);
    const [isClient, setIsClient] = useState(false);
    const [viewType, setViewType] = useState('dayGridMonth');
    const [dateRange, setDateRange] = useState('');
    const [showDebug, setShowDebug] = useState(false);

    // Debug logging
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

    const getViewIcon = (view) => {
        switch (view) {
            case 'dayGridMonth': return <Grid className="w-4 h-4" />;
            case 'timeGridWeek': return <List className="w-4 h-4" />;
            case 'timeGridDay': return <Clock className="w-4 h-4" />;
            default: return <Grid className="w-4 h-4" />;
        }
    };

    const getViewLabel = (view) => {
        switch (view) {
            case 'dayGridMonth': return 'Month';
            case 'timeGridWeek': return 'Week';
            case 'timeGridDay': return 'Day';
            default: return 'Month';
        }
    };

    if (!isClient) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background-50 to-background-300">
                <div className="animate-pulse">
                    <Calendar className="w-12 h-12 text-primary-600 animate-gentle-float" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background-50 via-background-100 to-background-200">
          

            {/* Main Content */}
            <section className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 mb-6">
                          
                            <div>
                                <h1 className="text-4xl md:text-5xl font-display font-bold bg-primary-gradient bg-clip-text text-transparent">
                                   Matukio Kwenye Calendar
                                </h1>

                            </div>
                        </div>
                    </div>

          

                    {/* User Cards Section */}
                    <div className="mb-12">
                        <UserCards />
                    </div>

                    {/* Calendar Section */}
                    <div className="mb-12">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl md:text-4xl font-display font-bold text-text-primary mb-4">
                                <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-yellow-500 bg-clip-text text-transparent">
                                    Ratiba za Mwezi za Usharika na Vikundi
                                </span>
                            </h2>
                           
                        </div>

                        {/* Calendar Controls */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                            {/* View Type Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-text-secondary">View:</span>
                                <div className="flex items-center bg-background-200 rounded-xl p-1">
                                    {['dayGridMonth', 'timeGridWeek', 'timeGridDay'].map((view) => (
                                        <button
                                            key={view}
                                            onClick={() => setViewType(view)}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                                                viewType === view
                                                    ? 'bg-white shadow-soft text-primary-600'
                                                    : 'text-text-secondary hover:text-text-primary hover:bg-background-100'
                                            }`}
                                        >
                                            {getViewIcon(view)}
                                            {getViewLabel(view)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Date Range Display */}
                            <div className="flex items-center gap-4">
                                {dateRange && (
                                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                                        <Calendar className="w-4 h-4" />
                                        <span>{dateRange}</span>
                                    </div>
                                )}

                                {/* Download Button */}
                                {showDownload && (
                                    <button
                                        onClick={() => generateTimetable(fullEvents, viewType, dateRange)}
                                        className="btn-primary flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium shadow-primary hover:shadow-primary-lg transition-all duration-300"
                                    >
                                        <Download className="w-4 h-4" />
                                        Pakua
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Calendar Container */}
                        <div className="glass-strong rounded-3xl p-6 md:p-8 shadow-medium">
                            <MinimalistCalendar 
                                events={fullEvents}
                                onEventClick={(event) => {
                                    setSelectedEvent(event);
                                    setModalOpen(true);
                                }}
                                onDownload={() => generateTimetable(fullEvents, viewType, dateRange)}
                                viewType={viewType}
                                dateRange={dateRange}
                            />
                        </div>

                     
                    </div>
                </div>
            </section>

            {/* Event Modal */}
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

export default Calendar2;