import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_PROFILE
} from './types';
import setAlert from './alert';
import setAuthToken from '../utils/setAutkToken';

// Load user
export const loadUser = () => async dispatch => {
  if(localStorage.token){
    setAuthToken(localStorage.token)
  }
  
  try {
    const res = await axios.get('/api/auth');
    
    dispatch({
      type: USER_LOADED,
      payload: res.data
    });

  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }

}

// Register user
export const register = ({name, email, password}) => async dispatch => {
  
  const newUser = {
    name,
    email,
    password
  }
  
  const config = {
    headers: {
      'Content-Type': 'Application/json'
    }
  }
  
  try {

    const body = JSON.stringify(newUser);
    const res = await axios.post('/api/users', body, config);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data 
    })
    dispatch(loadUser());
    dispatch(setAlert('User has been added!', 'success', 5000));

  } catch (err) {

    dispatch({
      type: REGISTER_FAIL,
    })
    const errors = err.response.data.errors;
    if(errors){
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 5000)))
    }
  
  }
}

// Login user
export const login = (email, password) => async dispatch => {
  
  const config = {
    headers: {
      'Content-Type': 'Application/json'
    }
  }
  
  try {

    const body = JSON.stringify({
      email,
      password
    });
    const res = await axios.post('/api/auth', body, config);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data 
    })
    dispatch(loadUser());
    // dispatch(setAlert('User has been added!', 'success', 5000));

  } catch (err) {

    dispatch({
      type: LOGIN_FAIL,
    })

    const errors = err.response.data.errors;
    if(errors){
      errors.forEach(error => dispatch(setAlert(error.msg, 'danger', 5000)))
    }
  
  }
}


// Logout Clear profile
export const logout = () => dispatch => {
  dispatch({ type: CLEAR_PROFILE })
  dispatch({ type: LOGOUT })
} 