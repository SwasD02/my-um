
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
//import Dashboard from './pages/dashboard';
//import LayoutWithSidebar from './pages/LayoutWithSidebar';
import UserPage from './pages/userPage';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Home/>}></Route>
      {/*<Route element={<LayoutWithSidebar/>}>*/}
        <Route path="/userpage" element={<UserPage/>}/>
      {/*</Route>*/}
        <Route path="/login" element={<LoginPage/>}/>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
