import { useNavigate } from 'react-router-dom';
import './leftProfile.css';

const LeftProfile = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate('/');
  };

  const dayItems = ['DAY 1', 'DAY 2', 'DAY 3'];

  return (
    <div className="left-profile">
      <div className="home-button" onClick={handleHomeClick}>
        <span>HOME</span>
        <div className="arrow-icon">◀</div>
      </div>
      
      <div className="day-list">
        {dayItems.map((day, index) => (
          <div key={index} className="day-item">
            <span>{day}</span>
            <div className="day-separator"></div>
          </div>
        ))}
      </div>
      
      <div className="user-section">
        <div className="user-button">
          <div className="user-icon">●</div>
          <span className="username">USER NAME</span>
        </div>
      </div>
    </div>
  );
};

export default LeftProfile;