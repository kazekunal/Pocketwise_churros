import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Events = () => {
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:3000/events', { location }); // POST with body
            // Store events in sessionStorage or pass them to the next page via state
            sessionStorage.setItem('events', JSON.stringify(response.data.events));  // Store in session storage
            sessionStorage.setItem('location', location);  // Store location
            router.push('/events');  // Navigate to the events page
        } catch (error) {
            setError(error.response?.data?.error || 'Error fetching events');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Upcoming Events</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Loading...' : 'Get Events'}
                </button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
};

export default Events;
