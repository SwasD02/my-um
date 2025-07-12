
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Dashboard from './pages/dashboard';
import LayoutWithSidebar from './pages/LayoutWithSidebar';

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path = "/" element={<Home/>}></Route>
      <Route element={<LayoutWithSidebar/>}>
        <Route path="/dashboard" element={<Dashboard/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
