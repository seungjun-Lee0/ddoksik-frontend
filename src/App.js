import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from '../src/components/shared/Header';
import Footer from '../src/components/shared/Footer';
import Login from './components/Login';
import Register from './components/Register';
import HealthProfileForm from './components/HealthProfileForm';
import ViewHealthProfile from './components/ViewHealthProfile';
import { Home } from '../src/components/shared/Home';
import { checkTokenValidity } from '../src/services/UserService';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    const userInfo = localStorage.getItem('userInfo');
    if (token && userInfo) {
      checkTokenValidity(token).then(() => {
        const userObj = JSON.parse(userInfo);
        userObj.token = token;
        setUser(userObj);
        setLoading(false);
      }).catch(() => {
        // 토큰이 유효하지 않은 경우, 로그아웃 처리
        console.log('Token is invalid or expired');
        handleLogout();
      });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLoginSuccess = (userInfo) => {
    localStorage.setItem('userToken', userInfo.token);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    setUser(userInfo);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    setLoading(false);
  };

  // Show loading state while checking for user token
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/home" /> : <Navigate to="/login" />} />
        <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/view-health-profile" element={user ? <ViewHealthProfile userId={user.user_id} token={user.token} /> : <Navigate to="/login" />} />
        <Route path="/health-profile" element={user ? <HealthProfileForm userId={user.user_id} token={user.token} /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
