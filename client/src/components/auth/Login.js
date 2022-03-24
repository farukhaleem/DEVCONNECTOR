import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom";
import {connect} from 'react-redux';
import { PropTypes } from 'prop-types';
import { login } from '../../actions/auth'; 
import Alert from './../layout/Alert' 

const Login = ({ login, isAuthenticated }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const {email, password} = formData;
  let navigate = useNavigate();
  
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  const postFormData = async e => {
    e.preventDefault();
    login(email, password);
  }

  // redirect if login
  useEffect(() => {
    if(isAuthenticated){
      navigate("/dashboard");
    }
  },[isAuthenticated]);  

  return (
    <section className="container">
      <Alert />
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={e => postFormData(e)}>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email"
            onChange={e => onChange(e)} 
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </section>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

Login.propTypes = {
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool
}

export default connect(mapStateToProps, {login} )(Login);