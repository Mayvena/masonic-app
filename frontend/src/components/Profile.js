// client/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import api from '../services/api';

function Profile() {
  const [profile, setProfile] = useState({});

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/profile', profile);
      alert('Profile updated');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div>
      <h2>Your Profile</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" value={profile.email || ''} placeholder="Email"
          onChange={handleChange} required />
        <input name="phone" value={profile.phone || ''} placeholder="Phone"
          onChange={handleChange} />
        <input name="profession" value={profile.profession || ''}
          placeholder="Profession" onChange={handleChange} />
        <input name="masonic_degree" value={profile.masonic_degree || ''}
          placeholder="Masonic Degree" onChange={handleChange} />
        <input name="lodge_position" value={profile.lodge_position || ''}
          placeholder="Lodge Position" onChange={handleChange} />
        <input name="profile_photo" value={profile.profile_photo || ''}
          placeholder="Profile Photo URL" onChange={handleChange} />
        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
}

export default Profile;