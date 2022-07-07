import React ,{useMemo} from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import QQMusic from './pages/QQMusic';
import UserInfo from './pages/QQMusic/userInfo';
import Songlist from './pages/QQMusic/Songlist'
import Info from './pages/QQMusic/Info'

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/qqmusic" element={<QQMusic/>}></Route>
        <Route path="/userinfo" element={<UserInfo/>}>
          <Route path="/userinfo/songlist/:listId" element={<Songlist/>}></Route>
          <Route path="/userinfo/info" element={<Info/>}></Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const App = () => {
  return <Router/>
}

export default App;
