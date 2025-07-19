import {MapContainer,TileLayer,Marker,Polyline,Popup,useMap,useMapEvents,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css";
import { useState, useEffect, useContext } from "react";

import TripContext from "../context/TripContext";

const api_ORS = process.env.REACT_APP_OPEN_ROUTE_API_KEY;

function MapResizer() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();

    const handleResize = () => {
      map.invalidateSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [map]);

  return null;
}

const custIcon = L.divIcon({
        className: "custom-svg-icon", 
        html: `
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-map-pin">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path>
        <circle cx="12" cy="9" r="3"></circle>
        </svg>
        `, 
        iconSize: [40, 40], 
        iconAnchor: [20, 40], 
        popupAnchor: [0, -40], 
});

function MapActions() {
  const map = useMap();

  const panToNewLocation = () => {
    map.flyTo([49.8954, -97.1385]);
  };

  const zoomIn = () => {
    map.zoomIn();
  };

  const zoomOut = () => {
    map.zoomOut();
  };

  useMapEvents({
    click(e) {

      /*L.marker(e.latlng, { icon: custIcon })
        .addTo(map)
        .bindPopup(
          `Clicked at: ${e.latlng.lat.toFixed(4)}, ${e.latlng.lng.toFixed(4)}`
        )
        .openPopup();*/
    },
    zoomend() {
      console.log("Map zoom ended:", map.getZoom());
    },
  });

  return (
    <div
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        zIndex: 1000,
        background: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      }}
    >
      <button onClick={panToNewLocation}>Pan to Winnipeg</button>
      <button onClick={zoomIn}>Zoom In</button>
      <button onClick={zoomOut}>Zoom Out</button>
      <p>Click on the map to add a marker!</p>
    </div>
  );
}

const OpenRouteServicePolyline = ({startCoords, endCoords, api_key}) => {
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
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json, application/geo+json, application/gpx+xml, application/zipped-pbf',
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error.message || 'Unknown error'}`);
        }

        const data = await response.json();

        if (data.features && data.features.length > 0) {
          const decodedPolyline = data.features[0].geometry.coordinates.map(coord => [coord[1], coord[0]]);
          setRoute(decodedPolyline);

          if (decodedPolyline.length > 0) {
            const bounds = L.latLngBounds(decodedPolyline);
            map.fitBounds(bounds, { padding: [50, 50] }); 
          }

        } else {
          setError("No route found for the given coordinates.");
        }
      } catch (e) {
        console.error("Error fetching route:", e);
        setError(`Failed to fetch route: ${e.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchRoute();
  }, [startCoords, endCoords, api_key, map]); 

  if (loading) {
    return <div className="text-center p-4 text-blue-600">Loading route...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-600">Error: {error}</div>;
  }

  return route ? (
    <Polyline pathOptions={{ color: 'blue', weight: 5, opacity: 0.7 }} positions={route} />
  ) : null;
}


/*const CurrLocation = () => {

    const map = useMap();

    useEffect(() => {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
            alert('Geolocation is not supported by your browser. Cannot get current location.');
        return;
        }

        const onSuccess = (pos) => {
            const { latitude, longitude } = pos.coords;
            map.flyTo([latitude, longitude], map.getZoom());

            L.marker([latitude, longitude], { icon: custIcon }) 
            .addTo(map)
            .bindPopup('You are here!')
            .openPopup();
        }

        const onError = (error) => {
            console.log("Error fetching location!" + {error});
            alert('Error getting location: ' + error.message);
        }

        navigator.geolocation.getCurrentPosition(onSuccess, onError, {
           enableHighAccuracy: true,
           timeout: 10000,
           maximumAge: 0,
        });
    
    }, [map]);
}*/ 

const MapView = () => {
  const {trips} = useContext(TripContext);
  const [initialPosition, setInitialPosition] = useState(null);
  const [finalPosition, setFinalPosition] = useState(null);

  useEffect(() => {
    setInitialPosition([49.8083, -97.1343]);
    setFinalPosition([49.887379, -97.131187]);
  },[]);

  
  //This makes sure all the polylines are in an array and then rendered all at once [DOESN'T THROW too many renders]
  const allTripsPolyline = [];
  let currStart = initialPosition;

  if(initialPosition && trips.length > 0){
    trips.forEach((eachTrip, index) => {
      const end = [eachTrip.coordLat, eachTrip.coordLong];

      allTripsPolyline.push(
        <div>
        <OpenRouteServicePolyline
          key = {eachTrip.id || index}
          startCoords={currStart}
          endCoords={end}
          api_key={api_ORS}
        />
        <Marker position={end} icon={custIcon}> 
          <Popup>{eachTrip.title}{eachTrip.address}</Popup>
        </Marker>
        </div>
      );

      currStart = end;
    })
  }

  if(!initialPosition || !finalPosition){
    return(
      <div>
        LOADING...
      </div>
    )
  }

  return (
    <MapContainer
      center={initialPosition}
      zoom={13}
      scrollWheelZoom={true}
      className="leaflet-container"
    >
      <TileLayer
        attribution='&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
      />
      <Marker position={initialPosition} icon={custIcon}>
        <Popup>Initial Location</Popup>
      </Marker>
      {/*<CurrLocation/>*/}

      {/*<OpenRouteServicePolyline
        startCoords={initialPosition}
        endCoords={finalPosition}
        api_key={api_ORS}
        />*/}

      {allTripsPolyline}

      <MapActions />
      <MapResizer />
    </MapContainer>
  );
};

export default MapView;
