import {MapContainer,TileLayer,Marker,Popup,useMap,useMapEvents,} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "./MapView.css";
import { useEffect } from "react";

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

const OpenRouteServicePolyline = ({startcoords, endcoords, API_KEY}) => {

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
  const initialPosition = [49.8083, -97.1343];

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
      <MapActions />
      <MapResizer />
    </MapContainer>
  );
};

export default MapView;
