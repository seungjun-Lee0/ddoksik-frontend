import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, fetchUserDetails } from '../services/UserService';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = await login(username, password);
      const userDetails = await fetchUserDetails(username, loginData.access_token);

      onLoginSuccess({
        user_id: userDetails.id,
        token: loginData.access_token,
      });

      navigate(userDetails.health_profiles && userDetails.health_profiles.length > 0 ? '/home' : '/health-profile');
    } catch (error) {
      setError('Failed to login. Please check your username and password.');
      console.error('Login Error:', error.response ? error.response.data : error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <button type="button" onClick={() => navigate('/register')}>Register</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Login;