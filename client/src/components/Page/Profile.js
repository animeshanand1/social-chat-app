import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPen
} from "@fortawesome/free-solid-svg-icons";
import { fetchProfile } from '../../store/profileSlice';

const ProfilePage = () => {
    const userToken = useSelector((state) => state.auth.token)
    const dispatch = useDispatch()
    const { data: Profile, status, error } = useSelector((state) => state.profile)
    
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthday, setDateOfBirth] = useState('');
    const [city, setCity] = useState('');

    useEffect(() => {
        
        dispatch(fetchProfile())
    }, [])
    if (status === "loading") {
        console.log('loading')
        return <p>Loading...</p>;
    }

    if (error) {
        console.log('wrong')
        return <p>Error: {error}</p>;
    }
    if (!Profile.myProfile) {
        console.log('not loaded')
    }

    const handleCoverPhotoChange = (event) => {

        const file = event.target.files[0];
        if (file) {
            console.log('file for uploading cp', file)
            setCoverPhoto(file);
            console.log('first', coverPhoto);
        }
    };

    const handleProfilePhotoChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('file for uploading dp', file)
            setProfilePhoto(file);
            console.log('2nd', profilePhoto);
        }

    };
    const handleProfileForm = (event) => {
        event.preventDefault();
        let userId
        try {
            const decodedToken = jwtDecode(userToken);
            userId = decodedToken.id;

        } catch (error) {
            console.error('Invalid token:', error);
            return;
        }
        const firstName = event.target.firstName.value;
        const lastName = event.target.lastName.value;
        const birthday = event.target.birthday.value;
        const city = event.target.city.value;


        try {
            if (!profilePhoto && !coverPhoto) {
                console.log('no photo');
                const response = axios.post(`http://localhost:5000/profile/update/${userId}`, { firstName, lastName, birthday, city })
                console.log(response, 'response');
            }
            // if updating profile photo or cover photo or both
            else {
                console.log('profile photo');
                const formData = new FormData();
                formData.append('profilePhoto', profilePhoto);
                formData.append('coverPhoto', coverPhoto);
                formData.append('firstName', firstName);
                formData.append('lastName', lastName);
                formData.append('birthday', birthday);
                formData.append('city', city);
                const response = axios.post(`http://localhost:5000/profile/update/${userId}`, formData);
                console.log(response, 'response in form data after pics');
            }

        } catch (error) {
            console.log(error);
            console.error(error.message);
        }
    };
    return (
        <div className="profile-page">
            <div className="form-section">
                <h2>Profile Form</h2>
                <form onSubmit={handleProfileForm} encType='multipart/form-data'>
                    <div className="form-group">
                        <label htmlFor="firstName">First Name</label>
                        <input type="text" id="firstName" placeholder="Enter your first name" value={firstName} onChange={((e) => setFirstName(e.target.value))} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="lastName">Last Name</label>
                        <input type="text" id="lastName" placeholder="Enter your last name" value={lastName} onChange={((e) => setLastName(e.target.value))} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthday">Birthday</label>
                        <input type="date" id="birthday" placeholder="mm/dd/yyyy" value={birthday} onChange={((e) => setDateOfBirth(e.target.value))} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="city">City</label>
                        <input type="text" id="city" placeholder="Enter your city" value={city} onChange={((e) => setCity(e.target.value))} />
                    </div>

                    <button type="submit" className="submit-btn">submit</button>
                </form>
            </div>

            <div className="profile-section">
                <div className="cover-photo">
                    <img
                        src={Profile.myProfile?.coverPhoto || 'cover.jfif'}
                        alt="Cover"
                        className="cover-img"
                    />
                    <input
                        type="file"
                        id="coverPhotoInput"
                        style={{ display: 'none' }}
                        onChange={handleCoverPhotoChange}
                    />
                    <label htmlFor="coverPhotoInput" className="change-cover-btn">
                        Change Cover Photo
                    </label>
                </div>

                <div className="profile-photo-container">
                    <img
                        src={Profile.myProfile?.profilePhoto || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTRRBoCLmo6qq0dz_YphDKai7_9js1LBuaCkQ&s'}
                        alt="Profile"
                        className="profile-photo"
                    />
                    <input
                        type="file"
                        id="profilePhotoInput"
                        style={{ display: 'none' }}
                        onChange={handleProfilePhotoChange}
                    />
                    <label htmlFor="profilePhotoInput" className="change-profile-btn">
                        <FontAwesomeIcon icon={faPen} />
                    </label>
                </div>
                {Profile ? <div className="profile-details">

                    <h3>{Profile.myProfile?.firstName || ''}<span style={{ fontWeight: '700', marginLeft: "5px" }}>{Profile.myProfile?.lastName || ''}</span></h3>
                    <p>City: {Profile.myProfile?.city || ''}</p>
                    {/* button to follow or message */}
                    <button style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        marginRight: '10px'
                    }}>
                        Followers:125
                    </button>

                    <button style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 20px',
                        cursor: 'pointer'
                    }}>
                        Following:18
                    </button>

                    <p style={{ color: 'magenta', fontWeight: "500" }}>
                        Birthday: {Profile.myProfile?.birthday ? Profile.myProfile.birthday.slice(0, 10) : ''}
                    </p>

                </div> : <p>Loading profile...</p>}

            </div>
        </div>
    );
};

export default ProfilePage;
