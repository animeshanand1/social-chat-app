// Login
import React, { useState } from 'react';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { setToken } from '../../store/authSlice';
const Login = () => {
  const [email,setEmail]=useState('aishwarya@gmail.com')
  const [password,setPassword]=useState('1')
  const [error,setError]=useState('')
  const navigate=useNavigate()
  const dispatch=useDispatch()
  const handleLogin=async(e)=>{
    e.preventDefault();
    try {
      const response=await axios.post('http://localhost:5000/account/login',{
        email,
        password
      })
      const token=response.data.token
      localStorage.setItem('token',token)
      dispatch(setToken(token))
      console.log('after dispatch')
      const decodedToken=jwtDecode(token)
      console.log('decodedToken:',decodedToken)
      localStorage.setItem('userId',decodedToken.id)
      localStorage.setItem('profileId',decodedToken.profileId)
      localStorage.setItem('username',decodedToken.name)
      navigate('/explore')
      
    } catch (error) {
      setError('invalid credentials')
    }
  }
  return (
    <div className="Login">
      <div className="Login__left">
        <div className="Login__logo">
          <div className="Login__logoIcon">
            <img src='3c228fec-4a69-4f97-9138-d3f33fcc983e.png' alt='chat-logo' className='login-app-logo'/>
          </div>
          <h1>Digital Chat</h1>
        </div>
      </div>

      <div className="Login__right">
        <form className="Login__form" encType='multipart/application' onSubmit={handleLogin}>
          <h2 className="Login__heading">Login to Digital Chat</h2>
          <input
            type="email"
            placeholder="email"
            value={email}
            className="Login__input Login__input--username"
            onChange={(e)=>setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="Login__input Login__input--password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
          />
          
          <button type="submit" className="Login__button Login__button--continue">
            Login
          </button>
          {error?'Wrong Password':''}
          <button type="button" className="Login__button Login__button--findFriends">
            Share Your Smile with this world and Find Friends
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
