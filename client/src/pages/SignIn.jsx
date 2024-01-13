import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signInStart, signInSuccess, signInFailure } from '../redux/user/userSlice';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.user.loading);
  const error = useSelector((state) => state.user.error);

  const [formData, setFormData] = useState({
    userNameOrEmail: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      console.log(data);
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Sign In</h2>
      <form onSubmit={handleSubmit}>
        {/* UserName or Email */}
        <div className="mb-3">
          <label htmlFor="userNameOrEmail" className="form-label">
            UserName or Email
          </label>
          <input
            type="text"
            className="form-control"
            id="userNameOrEmail"
            name="userNameOrEmail"
            value={formData.userNameOrEmail}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Signing In...' : 'Sign In'}
        </button>

        {/* Error message */}
        {error && <div className="text-danger mt-3">{error}</div>}

        {/* Paragraph with SignUp link */}
        <p className="mt-3">
          Don't have an account? <Link to="/sign-up">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
