import {useContext} from 'react'
import TripContext from "../context/TripContext";
import {useState} from 'react';

const TripList = () => {

    const {trips, addTrip, deleteTrip} = useContext(TripContext);

    const [tripTitle, setTripTitle] = useState('');
    const [tripStartTime, setTripStartTime] = useState("00:00");
    const [tripEndTime, setTripEndTime] = useState("00:00");
    const [location, setLocation] = useState('');


    if(trips.length === 0){
        return(
            <p>No events found!</p>
        )
    }

    const addTripSubmit = (e) => {
        e.preventDefault();

        if(!tripTitle || !tripStartTime || !tripEndTime || !location){
            alert("Fill in all the fields!");
            return;
        }

        const tripData = {
            title : tripTitle, 
            startTime: tripStartTime, 
            endTime: tripEndTime, 
            address: location,
        };

        addTrip(tripData);

        setTripTitle("");
        setTripStartTime("00:00");
        setTripEndTime("00:00");
        setLocation("");
    }

    return (
        <div>
            <h1>List of events:</h1>
            {trips.length === 0 ? "No events found." : "The events for the day are: "}
            <ul>
                {trips.map((trip) => (
                    <li key={trip.id}>
                        <strong>{trip.title}</strong> at {trip.address}, from {trip.startTime} till {trip.endTime}
                        <button onClick={() => deleteTrip(trip.id)}>
                            DEL
                        </button>
                    </li> 
                )
                )}
            </ul>
            

            <h2> ADD AN EVENT: </h2>
            <form onSubmit={addTripSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={tripTitle} placeholder="Class : COMP 1010" onChange= {(e) => setTripTitle(e.target.value)}/>
                </div>
                <div>
                    <label>Start Time:</label>
                    <input type="time" value={tripStartTime} onChange= {(e) => setTripStartTime(e.target.value)}/>
                </div>
                <div>
                    <label>End time:</label>
                    <input type="time" value={tripEndTime} onChange= {(e) => setTripEndTime(e.target.value)}/>
                </div>
                <div>
                    <label>Location:</label>
                    <input type="text" value={location} placeholder="University of Manitoba" onChange= {(e) => setLocation(e.target.value)}/>
                </div>
                <button type="submit">ADD</button>
            </form>
        </div>
    )

}

export default TripList;