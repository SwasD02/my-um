import "./dashboard.css"
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";
import TripList from "../components/TripList";

const Dashboard = () => {
    return (
      <>
        <Navbar />
        <div className="dashboard">
          <h1>Hey!</h1>
          <p> From a variety given below, choose your events!</p>
          <div className="map-wrapper">
            <MapView />
          </div>
          <TripList />
        </div>
      </>
    );
    
}

export default Dashboard;