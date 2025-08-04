
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import UserPage from './pages/userPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Home/>}></Route>
        <Route path="/userpage" element={<UserPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
