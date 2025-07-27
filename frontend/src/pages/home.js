/*import './home.css'
import {useState, useEffect} from 'react'

const Home = () => {

    


}

export default Home;*/

//eslint-disable-next-line
import LandingIntro from "../components/LoadingIntro";
//eslint-disable-next-line
import {useState} from 'react'
import RouteScrollbar from "../components/RightScrollBar";

const Home = () => {
  const [showLanding, setShowLanding] = useState(true);

  return (
    <>
      {showLanding ? (
        <LandingIntro onFinish={() => setShowLanding(false)} />
      ) : ( 
          <RouteScrollbar></RouteScrollbar>
      )
      }

    </>
  );
};

export default Home;
