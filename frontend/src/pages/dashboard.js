import "./dashboard.css"
import Navbar from "../components/Navbar";
import MapView from "../components/MapView";

const Dashboard = () => {
    return (
        <>
        <Navbar/>
        <div className="dashboard"> 
        <h1>Hey!</h1>
        <p> From a variety given below, choose your events!</p>
        {/**EventList */}
        <div className="map-wrapper">
            < MapView />
        </div>
        </div>
        </>
    )
    
}

export default Dashboard;