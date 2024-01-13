import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateUserSuccess } from '../redux/user/userSlice';

const SignOut = () => {
  const dispatch = useDispatch();
  const [signOutMessage, setSignOutMessage] = useState(null);

  const handleSignOut = async () => {
    try {
      // Make a request to your server to clear the session/token
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include', // Include credentials for cross-origin requests
      });

      if (response.ok) {
        // Clear the user data from the Redux store
        dispatch(updateUserSuccess(null));

        // Display a success message and redirect the user to the sign-in page
        setSignOutMessage({ type: 'success', text: 'Sign out successful!' });
        setTimeout(() => {
          window.location.href = '/sign-in';
        }, 2000); // Redirect after 2 seconds
      } else {
        const errorData = await response.json();
        console.error('Error signing out:', errorData);

        // Display an error message
        setSignOutMessage({ type: 'error', text: 'Error signing out. Please try again.' });
      }
    } catch (error) {
      console.error('Error signing out:', error);

      // Display an error message
      setSignOutMessage({ type: 'error', text: 'Error signing out. Please try again.' });
    }
  };

  return (
    <div className="container mt-5 d-flex align-items-center justify-content-center">
      <div className="col-md-6 text-center">
        {signOutMessage && (
          <div className={`alert alert-${signOutMessage.type}`} role="alert">
            {signOutMessage.text}
          </div>
        )}
        <p className="fs-4 text-warning">Are you sure you want to sign out?</p>
        <button className="btn btn-danger" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default SignOut;
