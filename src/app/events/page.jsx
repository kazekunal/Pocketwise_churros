'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const EventsDisplay = () => {
    const [events, setEvents] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const storedEvents = sessionStorage.getItem('events');
        const storedLocation = sessionStorage.getItem('location');
        
        if (storedEvents) {
            setEvents(storedEvents.replace(/\\n/g, '\n'));
        }
        
        if (storedLocation) {
            setLocation(storedLocation);
        }
    }, []);

    return (
        <div className="min-h-screen bg-gray-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-100 mb-10">
                    Upcoming Events in {location}
                </h1>
                
                {events ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.split('\n\n')
                            .slice(1) // Skip the first event
                            .map((event, index) => {
                                const eventDetails = event.split('\n');
                                return (
                                    <Card 
                                        key={index}
                                        className="bg-gray-900 border-gray-800 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/10 cursor-pointer"
                                    >
                                        <CardContent className="p-6">
                                            {eventDetails.map((line, idx) => {
                                                if (idx === 0) {
                                                    return (
                                                        <h2 
                                                            key={idx}
                                                            className="text-xl font-semibold text-gray-100 mb-3"
                                                        >
                                                            {line}
                                                        </h2>
                                                    );
                                                }
                                                return (
                                                    <p 
                                                        key={idx}
                                                        className="text-gray-400 mb-2 last:mb-0 leading-relaxed"
                                                    >
                                                        {line}
                                                    </p>
                                                );
                                            })}
                                        </CardContent>
                                    </Card>
                                );
                        })}
                    </div>
                ) : (
                    <p className="text-xl text-center text-gray-400">
                        No events to display
                    </p>
                )}
            </div>
        </div>
    );
};

export default EventsDisplay;