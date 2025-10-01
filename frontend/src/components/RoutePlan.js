import { MapContainer, TileLayer, Marker, Polyline, Popup, useMap, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState, useEffect, useContext, useMemo, useRef } from "react";
import './RoutePlan.css'
import TripContext from "../context/TripContext";

import {X, MapPlus} from "lucide-react"

const api_ORS = process.env.REACT_APP_OPEN_ROUTE_API_KEY;
const api_Stadia = process.env.REACT_APP_STADIAMAP_API_KEY;

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [map]);

  return null;
}

const custIcon = L.divIcon({
  className: "custom-svg-icon",
  html: `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 85" fill="white">
      <path 
        stroke-width="4" 
        d="M 5,33.103579 C 5,17.607779 18.457,5 35,5 C 51.543,5 65,17.607779 65,33.103579 C 65,56.388679 40.4668,76.048179 36.6112,79.137779 C 36.3714,79.329879 36.2116,79.457979 36.1427,79.518879 C 35.8203,79.800879 35.4102,79.942779 35,79.942779 C 34.5899,79.942779 34.1797,79.800879 33.8575,79.518879 C 33.7886,79.457979 33.6289,79.330079 33.3893,79.138079 C 29.5346,76.049279 5,56.389379 5,33.103579 Z M 35.0001,49.386379 C 43.1917,49.386379 49.8323,42.646079 49.8323,34.331379 C 49.8323,26.016779 43.1917,19.276479 35.0001,19.276479 C 26.8085,19.276479 20.1679,26.016779 20.1679,34.331379 C 20.1679,42.646079 26.8085,49.386379 35.0001,49.386379 Z"
      />
    </svg>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 20],
  popupAnchor: [0, -40],
});

const userLocationIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png', // A distinct blue marker
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41], // Size of the icon
    iconAnchor: [12, 41], // Point of the icon which will correspond to marker's location
    popupAnchor: [1, -34], // Point from which the popup should open relative to the iconAnchor
    shadowSize: [41, 41] // Size of the shadow
});


function MapActions() {
  const [mapActTab, setMapActTab] = useState(true);
  const map = useMap();

  const panToNewLocation = () => map.flyTo([49.8954, -97.1385]);
  const zoomIn = () => map.zoomIn();
  const zoomOut = () => map.zoomOut();

  useMapEvents({
    click() {},
    zoomend() {
      console.log("Map zoom ended:", map.getZoom());
    },
  });

  const stopMapTab = () => {
    setMapActTab(false);
  }

  return (
    <>
    {mapActTab ? <div className="absolute top-2 left-2 z-[1000] bg-slate-800 p-3 rounded shadow-md space-y-1">
      <button onClick={stopMapTab}><X/></button>
      <button className="block w-full bg-blue-700 hover:bg-blue-600 text-white py-1 px-2 rounded" onClick={panToNewLocation}>Pan to Winnipeg</button>
      <button className="block w-full bg-green-700 hover:bg-green-600 text-white py-1 px-2 rounded" onClick={zoomIn}>Zoom In</button>
      <button className="block w-full bg-red-700 hover:bg-red-600 text-white py-1 px-2 rounded" onClick={zoomOut}>Zoom Out</button>
      <p className="text-sm text-gray-700">Click on the map to add a marker!</p>
    </div> : (
      <div className="absolute top-2 left-2 p-1 rounded">
        <MapPlus/>
      </div>
    )}
    </>
  );
}

const OpenRouteServicePolyline = ({ startCoords, endCoords, api_key, color }) => {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const map = useMap();

  useEffect(() => {
    const fetchRoute = async () => {
      setLoading(true);
      setError(null);
      setRoute(null);

      if (!api_key || !startCoords || !endCoords) {
        setError("API Key or coordinates are missing.");
        setLoading(false);
        return;
      }

      const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${api_key}&start=${startCoords[1]},${startCoords[0]}&end=${endCoords[1]},${endCoords[0]}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! ${errorData.error?.message || response.status}`);
        }
        const data = await response.json();
        if (data.features?.length > 0) {
          const decodedPolyline = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoute(decodedPolyline);
          if (decodedPolyline.length > 0) map.fitBounds(L.latLngBounds(decodedPolyline), { padding: [50, 50] });
        } else {
          setError("No route found for the given coordinates.");
        }
      } catch (e) {
        setError(e.message);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [startCoords, endCoords, api_key, map]);

  if (loading) return <div className="text-center p-4 text-blue-600">Loading route...</div>;
  if (error) return <div className="text-center p-4 text-red-600">Error: {error}</div>;

  return route ? (<>
    <svg
        width="100%"
        height="100%"
        viewBox="0 0 200 200"
        className="absolute inset-0"
        xmlns="http://www.w3.org/2000/svg"
    >
  <Polyline points="10,150 130,70 170,110"
          fill="none"
          className="polyline"
          style={{ stroke: color }}
          smoothFactor={1}
          pathOptions={{ color: color || 'blue', weight: 5, opacity: 0.7 }} positions={route} />
  </svg>
  </>) : null;
};

const RoutePlan = () => {
  const { trips } = useContext(TripContext);
  const [initialPosition, setInitialPosition] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const watchIdRef = useRef(null);

  useEffect(() => {

    if(trips[0]){
      setInitialPosition([trips[0].coordLat, trips[0].coordLong]);
    }

  }, [trips, userPos]);

  useEffect(() => {
    if(!navigator.geolocation){
      console.error("Geolocation not supported by the browser!");
      return;
    }

    const handleSuccess = (position) => {
      const { latitude, longitude } = position.coords;
      setUserPos([latitude, longitude]); // Update the user's live position
    };

    const handleError = (error) => {
      console.error("Error getting user location:", error);
    };

    watchIdRef.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );

    /*return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        console.log("Geolocation watch stopped.");
      }
    };*/

  }, []);

  const allTripsPolyline = useMemo(() => {
    if (!initialPosition || trips.length === 0) {
      return [];
    }

    const result = [];
    let currStart = initialPosition;

    trips.forEach((eachTrip, index) => {
      const end = [eachTrip.coordLat, eachTrip.coordLong];
      const hue = 60 + (150 * index) / (trips.length - 1);
      const color = `hsl(${hue}, 100%, 50%)`;

      result.push(
        <div key={eachTrip.id || index}>
          <OpenRouteServicePolyline
            startCoords={currStart}
            endCoords={end}
            api_key={api_ORS}
            color={color}
          />
          <Marker position={end} icon={custIcon}>
            <Popup>
              {eachTrip.title}
              <br />
              {eachTrip.address}
            </Popup>
          </Marker>
        </div>
      );

      currStart = end;
    });

    return result;
  }, [trips, initialPosition]);


  return (
    <MapContainer
      center={initialPosition || userPos || [49.887379, -97.131187]}
      zoom={13}
      scrollWheelZoom={true}
      className="w-full min-h-[calc(100vh-150px)] rounded-xl shadow-md"
    >

        <TileLayer
         attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url={`https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${api_Stadia}`}
        />

        {userPos && ( // Only render if userPos is available
            <Marker position={userPos} icon={userLocationIcon}>
                <Popup>You are here!</Popup>
            </Marker>
        )}


      {(initialPosition) && (
        <>
          <Marker position={initialPosition} icon={custIcon}>
            <Popup>Initial Location</Popup>
          </Marker>
          {allTripsPolyline}
        </>
      )}

      <MapActions />
      <MapResizer />
    </MapContainer>
  );
};

export default RoutePlan;
