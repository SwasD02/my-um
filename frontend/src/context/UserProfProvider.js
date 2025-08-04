import UserProfContext from "./UserProfContext";
import {useState, useEffect} from 'react';

const UserProfProvider = ({children}) => {
    const [userName, setUserName] = useState("guest");

    /*useEffect(() => { 
        setUserName("guest");
    },[]);*/


    const updateUserProf = (newUserName) => {
        if(newUserName){
            setUserName(newUserName);
            console.log("userName given");
        }else{
            console.log('userName not given');
        }
        
    }

    const logoutUserProf = () => {
        setUserName("guest");
    }


    const contextValue = {
        userName,
        updateUserProf,
        logoutUserProf
    };

    return (
        <UserProfContext.Provider value={contextValue}>
            {children}
        </UserProfContext.Provider>
    );
}

export default UserProfProvider;