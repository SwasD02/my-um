import React from 'react'

const UserProfContext = React.createContext({
    userName : "",
    userid: "",
    userDate: "",
    updateUserDate: () => {},
    updateUserID: () => {},
    updateUserProf : () => {},
    logoutUserProf : () => {}
});

export default UserProfContext;