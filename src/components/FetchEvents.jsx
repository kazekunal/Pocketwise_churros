import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

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
            const response = await axios.post('http://localhost:3000/events', { location });
            sessionStorage.setItem('events', JSON.stringify(response.data.events));
            sessionStorage.setItem('location', location);
            router.push('/events');
        } catch (error) {
            setError(error.response?.data?.error || 'Error fetching events');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full dark:bg-gray-800 rounded-xl  flex items-center justify-center py-4">
            <Card className="w-full max-w-4xl bg-gray-900 border-gray-600">
                <CardContent className="p-4">
                    <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                        <h1 className="text-2xl font-bold text-gray-100 whitespace-nowrap">
                            Find Upcoming Events In
                        </h1>
                        
                        <form onSubmit={handleSubmit} className="flex-1 w-full flex flex-col sm:flex-row items-center gap-3">
                            <div className="w-full">
                                <Input
                                    type="text"
                                    placeholder="Enter location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-400"
                                />
                            </div>
                            
                            <Button 
                                type="submit" 
                                disabled={loading}
                                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white transition-colors whitespace-nowrap"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Loading...
                                    </span>
                                ) : (
                                    'Get Events'
                                )}
                            </Button>
                        </form>
                    </div>
                    
                    {error && (
                        <p className="text-red-400 text-sm text-center mt-3">
                            {error}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Events;