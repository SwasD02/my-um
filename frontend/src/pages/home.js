//import './home.css'
import {useEffect} from 'react'

const Home = () => {

    useEffect(() => {
        fetch('api/events/')
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok');
            }
            return res.json(); 
        })
        .then((data) => {
            console.log('Fetched data:', data); 
        })
        .catch((error) => {
            console.error('Fetch error:', error); 
        });
    }, []);

    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center px-4">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* Left Side Image or Illustration */}
          <div className="hidden md:block">
            <img
              src="https://news.umanitoba.ca/wp-content/uploads/2016/11/Admin-sunrise.jpg"
              alt="University of Manitoba"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Right Side Text & CTA */}
          <div className="flex flex-col justify-center p-8 space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 leading-snug">
              Plan your day, <br />
              Own your time.
            </h1>
            <p className="text-gray-600 text-sm">
              Your personal daily activity planner with smart mapping and route
              optimization.
            </p>
            <a href="/dashboard">
              <button className="px-5 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition font-medium text-sm">
                Get Started
              </button>
            </a>
          </div>
        </div>
      </div>
    );

}

export default Home;