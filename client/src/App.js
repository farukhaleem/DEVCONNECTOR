import React, {Fragment, useEffect} from 'react';
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

// Redux
import { Provider } from 'react-redux';
import store from './store';
import setAuthToken from './utils/setAutkToken';
import { loadUser } from './actions/auth';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import PrivateRoute from './components/routing/PrivateRoute';
import EditProfile from './components/profile-forms/EditProfile';

if(localStorage.getItem('token')){
  setAuthToken(localStorage.getItem('token'))
}

const App = () => {
  
  useEffect( () => {
    store.dispatch(loadUser())
  }, [])

  return ( 
  <Provider store={store}>
    <Fragment>
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path='/dashboard'
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path='/create-profile'
            element={
              <PrivateRoute>
                <CreateProfile />
              </PrivateRoute>
            }
          />
          <Route
            path='/edit-profile'
            element={
              <PrivateRoute>
                <EditProfile />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </Fragment>
  </Provider>
)}


export default App;
