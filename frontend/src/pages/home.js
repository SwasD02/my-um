import './home.css'

const home = () => {
    return (
        
        <div className = "homeContainer">
       <div className ="homeBox">
        <div className="leftBox">
            {/*<img className="uniIMG" src="https://news.umanitoba.ca/wp-content/uploads/2016/11/Admin-sunrise.jpg" alt="UNIVERSITY OF MANITOBA"></img>*/}        
        </div>
        <div className="rightBox">
            <p>intro</p>
            <a href="/dashboard">
            <button className="WelcomeButton">welcome</button>
            </a>
        </div>
       </div>
       </div>
        
    )
}

export default home;