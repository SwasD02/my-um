import TripContext from "./TripContext";
import {useState, useEffect} from 'react';

const TripProvider = ({children}) => {
    const [trips, setTrips] = useState([]);
    const [dataArray, setDataArray] = useState([]);

    useEffect(() => {

        const listTrip = [
          {
            id: "1",
            title: "Class at Uni",
            address: "University of Manitoba",
            startTime: "10:00",
            endTime: "11:30",
            /*coords: {
              lat: 43.65107,
              lng: -79.347015,
            }*/
          },
          {
            id: "2",
            title: "go to gym",
            address: "Planet Fitness, Pembina Highway",
            startTime: "9:00",
            endTime: "9:45",
            /*coords: {
              lat: 43.65107,
              lng: -79.347015,
            }*/
          },
          {
            id: "3",
            title: "work",
            address: "Manitoba Legislative Assembly",
            startTime: "12:00",
            endTime: "13:00",
            /*coords: {
              lat: 43.65107,
              lng: -79.347015,
            }*/
          }
        ];

        setTrips(listTrip);
        setDataArray(listTrip);

    }, []);

    const addTrip = (newTrip) => {
       const ind = dataArray.length + 1;
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