import LeftProfile from "../components/leftProfile";
import {Outlet} from "react-router-dom"

const LayoutWithSidebar = () => {
    return (
        <>
        <LeftProfile />
        <Outlet /> 
        </>
    ) 

}

export default LayoutWithSidebar;