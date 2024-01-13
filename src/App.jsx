import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignOut from './pages/SignOut';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import Header from './components/Header';

export default function App() {

  return (
    <BrowserRouter>
          <Header/>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-out' element={<SignOut />} />
      </Routes>
    </BrowserRouter>
  );
}