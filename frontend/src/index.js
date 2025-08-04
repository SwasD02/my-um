import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import TripProvider from './context/TripProvider';
import UserProfProvider from './context/UserProfProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProfProvider>
    <TripProvider>
    <App />
    </TripProvider>
    </UserProfProvider>
  </React.StrictMode>
);

