

import {useState, useEffect} from 'react';

const Schedule = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

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

     if (loading) {
        return <p className="text-white min-h-screen p-9 text-center text-xl">Loading your schedule... ⏳</p>;
    }

    if (error) {
        return <p className="text-red-500 min-h-screen p-9 text-center text-xl">Error loading schedule: {error.message} Please try again later.</p>;
    }

    return (
        <div className="text-white min-h-screen p-9">
            <h1 className="text-5xl flex justify-center items-center font-semibold mb-4">Your Schedule</h1>
            {userEvents.length > 0 ? (
                <ul className="space-y-4">
                    {userEvents.map((day) => (
                        <li key={day._id || day.date} className="bg-slate-900 p-4 rounded-md mb-6">
                            <h2 className="text-2xl font-semibold mb-2">{day.date}</h2>
                            {day.events && day.events.length > 0 ? (
                                <ul className="space-y-3">
                                    {day.events.map((activity) => (
                                        <li key={activity._id || activity.name + activity.startTime} className="bg-slate-800 p-3 rounded-md">
                                            <div className="text-xl font-semibold">{activity.name}</div>
                                            <div className="text-sm text-gray-300">
                                                {activity.venue}
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                {activity.startTime} - {activity.endTime}
                                            </div>
                                            {activity.notes && <p className="text-sm italic text-gray-400 mt-1">{activity.notes}</p>}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-lg text-gray-400">No activities planned for this day.</p>
                            )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-lg flex justify-center items-center">You have no events scheduled yet. Start planning! </p>
            )}
        </div>
    );
    
}

export default Schedule;