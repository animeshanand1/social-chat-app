import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUsers,
  faUserPlus,
  faSignOutAlt,
  faSignInAlt
} from "@fortawesome/free-solid-svg-icons";
import { clearToken } from "../store/authSlice";

const Navbar = () => {
    
    const { receiptId } = useParams();
    const navigate=useNavigate()
    const authToken=useSelector((state)=>state.auth.token)
    const userInfo=useSelector((state)=>state.profile.data.myProfile)
   
    const[alert,setAlert]=useState('')
    const dispatch=useDispatch()
    const [profilePic,setProfilePic]=useState({})
    const isLoggedIn=authToken ? authToken:false
    const isOnLoginPage=window.location.pathname==='/login'
    
    const handleLogout=()=>{
      if(isLoggedIn){
          setAlert('Are You Sure?Logut Now')
          dispatch(clearToken())
          
          console.log('logging out')
        }
      navigate('/login')
        
    }
    useEffect(() => {
      if (userInfo) {
          setProfilePic(userInfo.profilePhoto);
      }
  }, [userInfo]); 

    
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img
          src={profilePic || "dp.png" }
          alt="User Avatar"
          className="navbar-avatar"
        onClick={()=>navigate('/profile')}/>
      </div>
      <div className="navbar-right">
        <button className="navbar-button" title="Message Center">
          <FontAwesomeIcon icon={faEnvelope} onClick={()=>navigate(`/message/${receiptId}`)}/>
          <span className="navbar-label">Message Center</span>
        </button>
        <button className="navbar-button" title="Find Friends">
          <FontAwesomeIcon icon={faUsers} onClick={()=>navigate('/explore')}/>
          <span className="navbar-label">Find Friends</span>
        </button>
        <button className="navbar-button" title="Manage Friends">
          <FontAwesomeIcon icon={faUserPlus} onClick={()=>navigate('/connections')}/>
          <span className="navbar-label">Manage Friends</span>
        </button>
        {isOnLoginPage ? (
      <button className="navbar-button" title="Signup">
        <FontAwesomeIcon icon={faSignInAlt} onClick={() => navigate('/register')} />
        <span className="navbar-label">Signup</span>
      </button>
    ) : isLoggedIn ? (
      <button className="navbar-button" title="Logout">
        <FontAwesomeIcon icon={faSignOutAlt} onClick={handleLogout} />
        <span className="navbar-label">Logout</span>
      </button>
    ) : (
      <button className="navbar-button" title="Login">
        <FontAwesomeIcon icon={faSignInAlt} onClick={() => navigate('/login')} />
        <span className="navbar-label">Login</span>
      </button>
    )}
      </div>
    </nav>
  );
};

export default Navbar;
