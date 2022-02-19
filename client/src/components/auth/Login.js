import React, {useState} from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';

const Login = () => {

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const {email, password} = formData;
  
  const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})
  const postFormData = async e => {
    e.preventDefault();
      
      const newUser = {
        email,
        password
      }

      try {
        
        const config = {
          headers: {
            'Content-Type': 'Application/json'
          }
        }

        const body = JSON.stringify(newUser);
        const res = await axios.post('/api/auth', body, config);
        console.log(res.data)

      } catch (err) {
        console.log(err.response.data)  
      }

  }

  return (
    <section className="container">
      <div className="alert alert-danger">
        Invalid credentials
      </div>
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

export default Login