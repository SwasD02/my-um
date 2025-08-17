import { useContext } from 'react';
import TripContext from "../context/TripContext";
import UserProfContext from '../context/UserProfContext';
import { useState, useEffect, useRef } from 'react';
import { CircleCheck } from 'lucide-react';

//const LOCATIONIQ_TOKEN = process.env.REACT_APP_LOCATION_IQ_KEY;

const TripList = () => {
  const { trips, addTrip, deleteTrip } = useContext(TripContext);
  const { userDate , updateUserDate } = useContext(UserProfContext);

  // eslint-disable-next-line 
  const [currentTime, setCurrentTime] = useState(new Date());

  const [tripTitle, setTripTitle] = useState('');
  const [tripCateg, setTripCateg] = useState('');
  const [tripNote, setTripNote] = useState('');
  const [tripStartTime, setTripStartTime] = useState("00:00");
  const [tripEndTime, setTripEndTime] = useState("00:00");
  const [location, setLocation] = useState('');
  const [coords, setCoords] = useState(null);

  let debounceTimer = useRef(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    updateUserDate(formatDate(currentTime));
  }, []);

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
    setTripStartTime("00:00");
    setTripEndTime("00:00");
    setLocation("");
    setCoords("");
    setTripCateg("");
    setTripNote("");
  };


  return (
    <div className=" text-white min-h-screen p-9">
      <h1 className="text-5xl flex justify-center items-center font-semibold mb-4">{formatDate(currentTime)}</h1>
      <p className="text-lg flex justify-center items-center mb-4">
        {trips.length === 0
          ? "No events found."
          : "The events for the day are:"}
      </p>

      <ul className="space-y-4">
        {trips.map((trip) => (
          <li key={trip._id} className="bg-slate-700 p-4 rounded-md flex justify-center items-center">
            <div className="flex-1">
              <div className="text-xl font-semibold">{trip.name}</div>
              <div className="text-sm text-gray-400">
                {trip.venue}
                <br />
                {trip.startTime} - {trip.endTime}
              </div>
              <div className="text-sm text-gray-400">
                {trip.notes}
              </div>

            </div>
            <button
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-200"
              onClick={() => deleteTrip(userDate, trip._id)}
            >
              Delete
            </button>
            <button
              className=" text-white px-4 py-2 rounded-md transition duration-200"
            >
              {<CircleCheck className="white"/>}
              {/*pinEve && <CircleCheck className="fill-white" onClick={setPinEve(false)}/>*/}
            </button>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-semibold mt-8 mb-4">Add an Event</h2>
      <form className="space-y-4" onSubmit={addTripSubmit}>

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


        <button
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
          type="submit"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default TripList;
