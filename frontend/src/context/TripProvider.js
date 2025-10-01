
import TripContext from "./TripContext";
import UserProfContext from "./UserProfContext";
import {useState, useEffect, useContext} from 'react';

const TripProvider = ({children}) => {
    const [trips, setTrips] = useState([]);

    const {userid, userDate, updateUserDate} = useContext(UserProfContext);

    useEffect(() => {

      const listTrip = async () => {
            const url = `api/users/events?userID=${userid}&date=${userDate}`;

            try{
                
                const res = await fetch(url, {
                  credentials : 'include'
                });

                if(!res.ok){
                    const errorData = await res.json();
                    console.error('Error fetching suggestions:', errorData.error || 'Unknown error');
                    setTrips([]);
                    return;
                }

                const data = await res.json();
                setTrips(data);

            }catch(err) {
                console.error("events client-side error:", err);
                setTrips([]);
            }
      };
      
        if(userid && userDate){
            listTrip();
        }else{
            setTrips([]);
        }

    
    }, [userid, userDate, updateUserDate]);

    

    const addTrip = async (newTrip) => {
       
       if (userid) {
         try {
           const res = await fetch("api/users/events", {
             method: "POST",
             headers: {
               "Content-Type": "application/json",
             },
             body: JSON.stringify({ userDate, event: newTrip }),
             credentials: 'include'
           });

           if (!res.ok) {
             const errorData = await res.json();
             console.error(
               "Error adding trip:",
               errorData.error || "Unknown error"
             );
             return;
           }

           const data = await res.json();
           setTrips((prevTrips) => [...prevTrips, data]);
         } catch (err) {
           console.error("Error adding trip:", err);
         }
       }else{
        const id = trips.length;
        setTrips((prevTrips) => [...prevTrips, {...newTrip, id}]);
        console.log("new trip added ", {...newTrip, id});
       }
       
    }

    const updateTrip = (updatedTrip) => {
        setTrips((prevTrips) => 
            prevTrips.map((trip) => trip.id === updatedTrip.id ? updatedTrip : trip)
        )
    };

    const deleteTrip = async (date, id) => {

        if (userid) {
            const res = await fetch(`api/users/events/${id}?date=${date}`, {
                method: "DELETE",
                headers: {
                "Content-Type": "application/json",
                },
                credentials: 'include',
            });

            if (!res.ok) {
                const errorData = await res.json();
                console.error(
                    "Error deleting trip:",
                    errorData.error || "Unknown error"
                );
            return;
          }

          //listTrip(userid, userDate);
          setTrips((prevTrips) => prevTrips.filter((trip) => trip._id !== id));    //For the UX part 
          console.log("Trip deleted successfully");
        }else{
           setTrips((prevTrips) => prevTrips.filter((trip) => trip.id !== id));
        }
        
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