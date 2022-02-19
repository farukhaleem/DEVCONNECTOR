import React, {Fragment} from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import './App.css';

import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';


const App = () => ( 
  <Fragment>
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </Fragment>
)


export default App;
