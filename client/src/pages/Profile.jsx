import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from '../redux/user/userSlice';

const Profile = () => {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [userName, setUserName] = useState(currentUser.userName);
  const [email, setEmail] = useState(currentUser.email);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
  
      if (newPassword !== confirmPassword) {
        console.error("New password and confirm password don't match.");
        return;
      }
  
      console.log('Password:', password);
      console.log('New Password:', newPassword);
      console.log('Confirm New Password:', confirmPassword);
  
      const response = await fetch(`/api/auth/update/${currentUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userName, email, password, newPassword, confirmPassword }),
      });
  
      console.log('Raw response:', response);
  
      if (response.ok) {
        const updatedUser = await response.json();
        dispatch(updateUserSuccess(updatedUser));
        console.log('User profile updated:', updatedUser);
      } else {
        const errorData = await response.json();
        dispatch(updateUserFailure(errorData.message));
        console.error('Error updating user profile:', errorData);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      console.error('Error updating user profile:', error);
    }
  };
  

  const handleSignOut = async () => {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        dispatch(updateUserSuccess(null));
        window.location.href = '/sign-in';
      } else {
        const errorData = await response.json();
        console.error('Error signing out:', errorData);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">User Profile</h1>
      <div className="row justify-content-center">
        <div className="col-md-6">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                name="username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Current Password
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label">
                New Password
              </label>
              <input
                type="password"
                className="form-control"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <input
                type="password"
                className="form-control"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update Profile
            </button>
          </form>
          <button className="btn btn-secondary mt-3" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
