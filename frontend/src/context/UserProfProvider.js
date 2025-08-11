import UserProfContext from "./UserProfContext";
import {useState, useEffect} from 'react';

const UserProfProvider = ({children}) => {
    const [userName, setUserName] = useState("");
    const [userid, setUserid] = useState("");


    const updateUserProf = (newUserName) => {
        if(newUserName){
            setUserName(newUserName);
        }else{
            console.log('userName not given');
        }
    }

    const updateUserID = (newUserID) => {
        if(newUserID){
            setUserid(newUserID);
        }else{
            console.log('no userID');
        }
    }

    const logoutUserProf = () => {
        setUserName("");
        setUserid("");
    }

    useEffect(() => {
        if(userName){
            console.log("userName updated to: " + userName);
        }
    }, [userName]);


    const contextValue = {
        userName,
        userid,
        updateUserProf,
        updateUserID,
        logoutUserProf
    };

    return (
        <UserProfContext.Provider value={contextValue}>
            {children}
        </UserProfContext.Provider>
    );
}

export default UserProfProvider;