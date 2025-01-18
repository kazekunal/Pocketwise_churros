'use client';
import React, { useEffect, useState } from 'react';

const EventsDisplay = () => {
    const [events, setEvents] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        // Retrieve events from sessionStorage
        const storedEvents = sessionStorage.getItem('events');
        const storedLocation = sessionStorage.getItem('location');
        
        if (storedEvents) {
            // Fixing the line breaks: replace `\n` with actual newlines and split by event
            setEvents(storedEvents.replace(/\\n/g, '\n'));
        }
        
        if (storedLocation) {
            setLocation(storedLocation);
        }
    }, []);

    // Card and Page Styles
    const cardStyle = {
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
        padding: '24px',
        marginBottom: '24px',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'pointer',
    };

    const titleStyle = {
        fontSize: '1.8rem',
        fontWeight: '600',
        color: '#333',
        marginBottom: '12px',
    };

    const detailStyle = {
        fontSize: '1rem',
        color: '#555',
        lineHeight: '1.6',
        marginBottom: '8px',
    };

    const headerStyle = {
        fontSize: '2rem',
        fontWeight: '700',
        textAlign: 'center',
        color: '#444',
        marginBottom: '40px',
    };

    // Hover effect for the cards
    const hoverEffectStyle = {
        ':hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
        },
    };

    return (
        <div style={{ padding: '40px 20px', backgroundColor: '#f9fafb' }}>
            <h1 style={headerStyle}>Upcoming Events in {location}</h1>
            {events ? (
                events.split('\n\n').map((event, index) => {
                    const eventDetails = event.split('\n'); // Split event into details
                    return (
                        <div key={index} style={{ ...cardStyle, ...hoverEffectStyle }}>
                            {eventDetails.map((line, idx) => {
                                if (idx === 0) {
                                    return <h2 style={titleStyle} key={idx}>{line}</h2>;
                                }
                                return (
                                    <p key={idx} style={detailStyle}>
                                        {line}
                                    </p>
                                );
                            })}
                        </div>
                    );
                })
            ) : (
                <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#888' }}>No events to display</p>
            )}
        </div>
    );
};

export default EventsDisplay;
