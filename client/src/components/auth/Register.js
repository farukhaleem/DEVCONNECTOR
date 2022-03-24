import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from "react-router-dom";
import setAlert from './../../actions/alert';
import Alert from './../layout/Alert' 
import { connect } from 'react-redux'
import {register} from './../../actions/auth';

const Register = ({setAlert, register, isAuthenticated}) => {

  let navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  })

  const {name, email, password, password2} = formData;
  
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  const postFormData = async e => {
    e.preventDefault();
    if(formData.password !== formData.password2){
      setAlert('Password do not match', 'danger', 5000)
    }else{
      register({name, email, password});
    }
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
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={e => postFormData(e)}>
        <div className="form-group">
          <input 
            type="text" 
            placeholder="Name" 
            name="name"
            onChange={e => onChange(e)} 
            required 
          />
        </div>
        <div className="form-group">
          <input 
            type="email" 
            placeholder="Email Address" 
            name="email"
            onChange={e => onChange(e)} 
          />
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            onChange={e => onChange(e)}
            minLength="6"
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </section>
  )
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated
})

const mapDispatchToProps = { setAlert, register }

export default connect(mapStateToProps, mapDispatchToProps)(Register)
