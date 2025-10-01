import {useState, useEffect, useRef, useContext} from 'react';
import TripContext from '../context/TripContext';
import UserProfContext from '../context/UserProfContext';
import { CirclePlus, Trash, ChevronDown } from 'lucide-react';

const FillForm = () => {
  const { addTrip } = useContext(TripContext);
  const { updateUserDate } = useContext(UserProfContext);

  const [tripTitle, setTripTitle] = useState('');
  const [tripCateg, setTripCateg] = useState('');
  const [tripNote, setTripNote] = useState('');
  const [tripStartTime, setTripStartTime] = useState("00:00");
  const [tripEndTime, setTripEndTime] = useState("00:00");
  const [tripDate, setTripDate] = useState('');
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);

  const [error, setError] = useState(null);

  let debounceTimer = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  const addTripSubmit = (e) => {
    e.preventDefault();

    if (!tripTitle || !tripStartTime || !tripEndTime || !location) {
      alert("Fill in all the fields!");
      return;
    }

    if(!coords || !coords.lat || !coords.lon) {
      alert("Please select a valid location from the suggestions.");  
      return;
    }

    const tripData = {
      name: tripTitle,
      category: tripCateg,
      startTime: tripStartTime,
      endTime: tripEndTime,
      venue: location,
      coordLat: coords.lat,
      coordLong: coords.lon,
      notes: tripNote,
    };

    addTrip(tripData);

    setTripTitle("");
    setTripDate("");
    setTripStartTime("00:00");
    setTripEndTime("00:00");
    setLocation("");
    setCoords("");
    setTripCateg("");
    setTripNote("");
  };

  const handleLocation = async (e) => {
    clearTimeout(debounceTimer);

    const value = e.target.value;
    setLocation(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    if (value.length < 3) {
      return;
    }

    debounceTimer = setTimeout(async() => {

      const url = `/api/locIQ/autoSuggest?q=${encodeURIComponent(value)}`;

      try {
        const res = await fetch(url);

        if (!res.ok) {
            const errorData = await res.json();
            console.error('Error fetching suggestions:', errorData.error || 'Unknown error');
            setSuggestions([]); 
            return;
        }

        const data = await res.json();
        setSuggestions(data);

      } catch (err) {
        console.error("Autocomplete client-side error:", err);
        setSuggestions([]);
      }

    }, 300);
  };

  const selectLocation = (place) => {
    setLocation(place.display_name);
    setSuggestions([]);
    setCoords({
      lat: place.lat,
      lon: place.lon
    });
  };

  const formatDate = (date) => {

    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  useEffect(() => {
    if((new Date(tripDate)).getFullYear() !== 2025){
        setError('Please ensure that you select a date ONLY from the year 2025.');
    }else if(tripDate){
        const date = formatDate(new Date(tripDate + 'T00:00:00'));
        console.log(date);
        updateUserDate(date);
        setError(null);
    }
  }, [tripDate, updateUserDate]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mt-8 mb-4">Add an Event</h2>
      <form className="space-y-4" onSubmit={addTripSubmit}>

        <div className="space-y-2">
          <label className="text-lg">Date:</label>
          <input
            type="date"
            value={tripDate}
            placeholder="2025-08-10"
            onChange={(e) => {
                setTripDate(e.target.value);
            }}
            className="w-full p-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg">Title:</label>
          <input
            type="text"
            value={tripTitle}
            placeholder="e.g., COMP 1010 Lecture"
            onChange={(e) => setTripTitle(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg">Category:</label>
          <input
            type="text"
            value={tripCateg}
            placeholder="Leisure"
            onChange={(e) => setTripCateg(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg">Start Time:</label>
          <input
            type="time"
            value={tripStartTime}
            onChange={(e) => setTripStartTime(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg">End Time:</label>
          <input
            type="time"
            value={tripEndTime}
            onChange={(e) => setTripEndTime(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg">Notes:</label>
          <input
            type="text"
            value={tripNote}
            placeholder="Go with Alexis. Meet David and Moira on the way!"
            onChange={(e) => setTripNote(e.target.value)}
            className="w-full p-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-lg">Location:</label>
          <input
            type="text"
            value={location}
            placeholder="Type the location..."
            onChange={handleLocation}
            className="w-full p-2 rounded-md bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {suggestions.length > 0 && (
            <ul className="bg-slate-600 rounded-md mt-2">
              {suggestions.map((place) => (
                <li
                  key={place.place_id}
                  onClick={() => selectLocation(place)}
                  className="cursor-pointer p-2 hover:bg-slate-500"
                >
                  {place.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className='text-red-500'>{error}</div>

        <button
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
          type="submit"
          disabled={!tripDate ||!location || !tripTitle || !tripCateg || !tripStartTime || !tripEndTime || !coords}
        >
          Add
        </button>
      </form>
    </div>
    );
}

const Routes = () => {
    const [userEvents, setUserEvents] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);

    const [openForm, setOpenForm] = useState(false);

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
       
    },[userEvents]);

    if (loading) {
        return <p className="text-white min-h-screen p-9 text-center text-xl">Loading your schedule... ⏳</p>;
    }

    if (error) {
        return <p className="text-red-500 min-h-screen p-9 text-center text-xl">Error loading schedule: {error.message} Please try again later.</p>;
    }

    return (
        <div className="text-white min-h-screen p-9">
            <h1 className="text-5xl flex justify-center items-center font-semibold mb-4">Plan your Routeine ahead of time!</h1>
            {userEvents.length > 0 ? (
                <ul className="space-y-4">
                    {userEvents.map((day) => (
                        <li key={day._id || day.date} className="bg-slate-950 p-4 rounded-md mb-6">
                            <h2 className=" text-2xl font-semibold mb-2">{day.date}</h2>
                            <ChevronDown/>
                            {day.events && day.events.length > 0 ? (
                                <ul className="space-y-3">
                                    {day.events.map((activity) => (
                                        <li key={activity._id || activity.name + activity.startTime} className="bg-slate-950 p-3 rounded-md border-l-2 hover:border-2">
                                            <div className="text-xl text-red-500 font-semibold">{activity.name}</div>
                                            <div className="text-sm text-gray-300">
                                                {activity.venue}
                                            </div>
                                            <div className="text-sm text-gray-300">
                                                {activity.startTime} - {activity.endTime}
                                            </div>
                                            {activity.notes && <p className="text-sm italic text-gray-400 mt-1">{activity.notes}</p>}
                                            <Trash/>
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

            {!openForm && <div className='space-y-4 p-4 flex justify-center items-center'><button className='bg-slate-900 flex justify-center items-center p-3 rounded-md mb-6 hover:bg-red-600' onClick={() => {setOpenForm(true)}}><CirclePlus/> &nbsp; ADD MORE EVENTS </button></div>}
            {openForm && <FillForm/>}


        </div>        
    );

}

export default Routes;