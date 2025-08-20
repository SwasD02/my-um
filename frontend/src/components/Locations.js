import React, { useState, useEffect, useContext} from 'react';
import {MoveLeft, MoveRight} from 'lucide-react'
import RoutePlan from './RoutePlan';
import UserProfContext from '../context/UserProfContext'

const Locations = () => {
    const {updateUserDate} = useContext(UserProfContext);

    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const [currDateIndex, setCurrDateIndex] = useState(0);
    const [currDate, setCurrDate] = useState(null);

    useEffect(() => {

        const fetchUserEvents = async () => { 
            try {
               
                const res = await fetch('/api/users/events/all', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    const errorMessage = errorData.error || 'Unknown error fetching events';
                    console.error('Error fetching events:', errorMessage);
                    setError(new Error(errorMessage)); 
                    setLoading(false);
                    return;
                }

                const data = await res.json();
                setUserEvents(data || []); 
                setLoading(false); 

            } catch (err) {
                console.error("Events client-side error:", err);
                setError(err); 
                setUserEvents([]); 
                setLoading(false); 
            }
        };

        fetchUserEvents();
       
    },[]);

    useEffect(() => {
        if (userEvents.length > 0 && currDateIndex >= 0 && currDateIndex < userEvents.length) {
            setCurrDate(userEvents[currDateIndex]);
        }
    }, [currDateIndex, userEvents]);

    useEffect(() => {
        if(currDate && currDate.date){
             updateUserDate(currDate.date);
        }
    }, [updateUserDate, currDate])

    if (loading) {
        return <p className="text-white min-h-screen p-9 text-center text-xl">Loading your schedule... </p>;
    }

    if (error) {
        return <p className="text-red-500 min-h-screen p-9 text-center text-xl">Error loading schedule: {error.message} Please try again later.</p>;
    }


    return (
    <div className="text-white min-h-screen p-9">
            <div className="flex justify-between items-center mb-4">
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                    disabled={currDateIndex <= 0}
                    onClick={() => setCurrDateIndex((prev) => prev - 1)}
                >
                    <MoveLeft />
                </button>

                <h1 className="text-3xl font-semibold text-center">Your Mapped Locations</h1>

                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
                    disabled={currDateIndex >= userEvents.length - 1}
                    onClick={() => setCurrDateIndex((prev) => prev + 1)}
                >
                    <MoveRight />
                </button>
            </div>

            {userEvents.length > 0 ? (
                <div>
                <div className="space-y-4">
                    <ul>
                    {currDate && (
                        <li key={currDate._id || currDate.date} className="bg-slate-900 p-4 rounded-md mb-6">
                            <h1 className="text-2xl font-semibold mb-2">{currDate.date}</h1>
                        </li>
                    )}
                    </ul>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className='flex-1 min-h-[calc(100vh-150px)]'>
                <RoutePlan/>
                </div>
                </div>
                </div>
                
            ) : (
                <p className="text-lg text-gray-400">No activities planned for this day.</p>
            )}
        </div>
    );
}

export default Locations;