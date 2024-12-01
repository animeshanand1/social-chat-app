// Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';

const Signup = (e) => {
  const [email, setEmail] = useState('abc@gmail.com')
  const [password, setPassword] = useState('111')
  const [confirmPassword, setConfirmPassword] = useState('111')
  const [error, setError] = useState('');
  const formRegisterSubmit = async (e) => {

    e.preventDefault()
   
    if (password !== confirmPassword) {
      
      setError('Passwords do not match.');
      return ;
    }
    else {
      try {
        const response = await axios.post('http://localhost:5000/account/signup', {

          email: email,
          password: password,
          confirmPassword: confirmPassword

        })
        
        if(response.status && response.status==200 || response.status==201){
          alert('User registered')
        }
      }

      catch (error) {
        console.error(error.message)
      }
    }
  }
  return (
    <div className="Signup">
      <div className="Signup__left">
        <form className="Signup__form" encType='multimedia/application' onSubmit={formRegisterSubmit}>
          <h2 className="Signup__heading">Create Your Digital Chat Account</h2>
          <input
            type="text"
            placeholder="email"
            className="Signup__input Signup__input--email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            className="Signup__input Signup__input--password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="Signup__input Signup__input--confirm"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button type="submit" className="Signup__button Signup__button--continue">
            Signup
          </button>
           {/* Display the error message if there's an error */}
          {error && <p style={{ color: 'red', display:'flex',justifyContent:'center'}}>{error}</p>}
          <button type="button" className="Signup__button Signup__button--findFriends">
            Share Your Smile with this world and Find Friends
          </button>
        </form>
      </div>

      <div className="Signup__right">
        <div className="Signup__logo">
          <div className="Signup__logoIcon">💬</div>
          <h1>Digital Chat</h1>
        </div>
      </div>
    </div>
  );
};

export default Signup;
