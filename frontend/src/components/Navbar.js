import { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="time-div">
          <div className="time-display">
            <span className="time">{formatTime(currentTime)}</span>
            <span className="date">{formatDate(currentTime)}</span>
          </div>
        </div>

        <div className="separator">|</div>
        
        <div className="temp-div">
          <div className="temp-content">
            <div className="temp-icon"></div>
            <div className="temp-info">
              <span className="temperature">24°C</span>
              <span className="weather">Sunny</span>
            </div>
          </div>
        </div>
      </div>

      <div className="navbar-right">
        <button 
          className={`theme-toggle ${isDarkMode ? 'dark' : 'light'}`}
          onClick={toggleTheme}
        >
          <div className="toggle-icon">
            {isDarkMode ? '🌙' : '☀️'}
          </div>
          <span className="toggle-text">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;