import UserProfContext from "./UserProfContext";
import {useState, useEffect} from 'react';

const UserProfProvider = ({children}) => {
    const [userName, setUserName] = useState("");
    const [userid, setUserid] = useState("");
    const [userDate, setUserDate] = useState("");


    const updateUserProf = (newUserName) => {
        if(newUserName){
            setUserName(newUserName);
        }else{
            console.log('userName not given');
            setUserName('');
        }
    }

    const updateUserID = (newUserID) => {
        if(newUserID){
            setUserid(newUserID);
        }else{
            console.log('no userID');
        }
    }

    const updateUserDate = (newUserDate) => {
        if(newUserDate){
            setUserDate(newUserDate);       
        }
        else{   
            console.log('no userDate');
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
        userDate,
        updateUserDate,
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