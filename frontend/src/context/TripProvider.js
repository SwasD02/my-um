import TripContext from "./TripContext";
import {useState, useEffect} from 'react';

const TripProvider = ({children}) => {
    const [trips, setTrips] = useState([]);
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {

        const listTrip = [
          {
            id: "0",
            title: "Class: COMP XYZA",
            address: "University of Manitoba",
            startTime: "10:00",
            endTime: "11:30",
            coordLat: "49.8054",
            coordLong: "-97.1401",
          },
          {
            id: "1",
            title: "Go to gym",
            address: "Planet Fitness, Pembina Highway",
            startTime: "9:00",
            endTime: "9:45",
            coordLat: "49.7977",
            coordLong: "-97.1482",
            
          },
          {
            id: "2",
            title: "Work",
            address: "Manitoba Legislative Assembly",
            startTime: "12:00",
            endTime: "13:00",
            coordLat: "49.88502",
            coordLong: "-97.14708",
          }
        ];

        setTrips(listTrip);
        setDataArray(listTrip);

    }, []);

    const addTrip = (newTrip) => {
       const ind = dataArray.length;
       setTrips((prevTrips) => [...prevTrips, {...newTrip, ind}]);
       console.log("new trip added ", {...newTrip, ind});
    }

    const updateTrip = (updatedTrip) => {
        setTrips((prevTrips) => 
            prevTrips.map((trip) => trip.id === updatedTrip.id ? updatedTrip : trip)
        )
    };

    const deleteTrip = (id) => {
        setTrips(
            (prevTrips) => 
                prevTrips.filter((trip) => trip.id !== id)
        )
    };

    const contextValue = {
        trips,
        addTrip,
        deleteTrip,
        updateTrip,
    };

    return (
        <TripContext.Provider value={contextValue}>
            {children}
        </TripContext.Provider>
    );
};

export default TripProvider;