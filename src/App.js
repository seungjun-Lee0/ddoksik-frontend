import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Login from './components/user/Login';
import DietPlans from './components/shared/Plans';
import PasswordReset from './components/user/PasswordReset';
import HealthProfileForm from './components/user/HealthProfileForm';
import ViewHealthProfile from './components/user/ViewHealthProfile';

import { Account } from './Context/Account';
import UserPool from './Context/UserPool';
import Settings from './components/user/Settings';
import Foods from './components/diet/AddFoods';
import MealType from './components/diet/MealTypeSelect';

import Home from './components/shared/Home';

import './assets/css/login.css';
import './assets/css/modals.css';
import './assets/css/main.scss';
import './assets/css/checkbox.scss';
import './assets/css/profile.css';
import './assets/css/list.css';
import './assets/css/loader.css';
import './assets/css/user-profile.scss';
import './assets/css/chart.css';
import './assets/css/home.scss';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if(localStorage.getItem("darkMode") == "true"){
      document.body.classList.add("dark-mode");
    }
    const userInfo = UserPool.getCurrentUser();
    if (userInfo) {
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
        <Route path="/login" element={user ? <Navigate to="/home" /> : <Login /> } />
        <Route path="/settings" element={user ? <Settings /> : <Navigate to="/login" /> } />
        <Route path="/search-foods" element={user ? <Foods /> : <Navigate to="/login" /> } />
        <Route path="/view-diet-plans" element={user ? <DietPlans /> : <Navigate to="/login" /> } />
        <Route path="/meal-type-select" element={user ? <MealType /> : <Navigate to="/login" /> } />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/view-health-profile" element={user ? <ViewHealthProfile /> : <Navigate to="/login" />} />
        <Route path="/health-profile" element={user ? <HealthProfileForm /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
      <Footer />
      </Account>
    </Router>
  );
}

export default App;
