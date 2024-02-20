import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../src/components/shared/Header';
import Footer from '../src/components/shared/Footer';
import Login from './components/Login';
import Register from './components/Register';
import PasswordReset from './components/PasswordReset';
import HealthProfileForm from './components/HealthProfileForm';
import ViewHealthProfile from './components/ViewHealthProfile';

import { Account } from './Context/Account';
import UserPool from './Context/UserPool';

import Settings from './components/Settings';

import Home from '../src/components/shared/Home';

import './assets/css/modals.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const userInfo = UserPool.getCurrentUser();
    if (userInfo) {
      console.log(userInfo)
        setUser(userInfo);
        setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);

  // Show loading state while checking for user token
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Account>
      <Header user={user} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={user ? <Home /> : <Login /> } />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" /> } />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/view-health-profile" element={user ? <ViewHealthProfile /> : <Navigate to="/login" />} />
        <Route path="/health-profile" element={user ? <HealthProfileForm /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
      <Footer user={user} />
      </Account>
    </Router>
  );
}

export default App;
