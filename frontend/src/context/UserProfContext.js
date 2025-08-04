import React from 'react'

const UserProfContext = React.createContext({
    userName : "",
    updateUserProf : () => {},
    logoutUserProf : () => {}
});

export default UserProfContext;