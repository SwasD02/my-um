import React from 'react'

const TripContext = React.createContext({
    trips:[],
    addTrip: () => {},
    deleteTrip: () => {},
    updateTrip: () => {},
});

export default TripContext;