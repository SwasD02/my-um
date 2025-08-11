import React from 'react'

const UserProfContext = React.createContext({
    userName : "",
    userid: "",
    updateUserID: () => {},
    updateUserProf : () => {},
    logoutUserProf : () => {}
});

export default UserProfContext;