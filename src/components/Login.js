import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AccountContext } from '../Context/Account';
import UserPool from '../Context/UserPool';
import { fetchUserHealthProfile } from '../services/HealthProfileService';

import '../assets/css/login2.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [name, setName] = useState('');

  const navigate = useNavigate();

  const { authenticate, signUp } = useContext(AccountContext);

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    
    authenticate(email, password)
    .then(data => {
        console.log("Logged in!", data);
        fetchUserHealthProfile(UserPool.getCurrentUser().username, data.idToken.jwtToken)
        .then(profile => {
          window.location.href = '/home'
        })
        .catch(error => {
          // 에러 발생 시 특정 URL로 리다이렉트
          window.location.href = '/health-profile'; // 리다이렉트할 URL
        });
    })
    .catch(err => {
        console.error("Failed to Log in", err);
    })
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();

    signUp(email, name, password).then(data => {
      console.log("registered Successfully", data)
    })
    .catch(err => {
      console.log("Failed to register", err);
    })
  };

  const confirmRegistration = () => {
    const user = new CognitoUser({
        Username: email,
        Pool: UserPool,
    });

    user.confirmRegistration(confirmationCode, true, (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result); // 'SUCCESS'를 기대합니다.
        navigate('/home'); // 이메일 확인 후 홈 페이지로 이동
    });
  };
  
  const goToResetPassword = () => {
    navigate('/reset-password');
  }

  return (
    <div className="wrapper">
    <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`}>
    <div className="sign-up-container">
      <form onSubmit={onSubmitRegister}>
        <h1>Create Account</h1>
       
        <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        placeholder="Confirmation Code"
        value={confirmationCode}
        onChange={(e) => setConfirmationCode(e.target.value)}
      />
      <button type="button" onClick={confirmRegistration} className="form_btn">Confirm Registration</button>
      <button type="submit" className="form_btn">Register</button>
      </form>
    </div>
    <div className="sign-in-container">
      <form onSubmit={onSubmitLogin}>
        <h1>Sign In</h1>
        
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        <button type="submit" className="form_btn">Sign In</button>
      </form>
    </div>
    <div className="overlay-container">
        <div className="overlay-left">
          <h2>Welcome Back</h2>
          <button id="signIn" className="overlay_btn" onClick={() => setIsRightPanelActive(false)}>Sign In</button>
        </div>
        <div className="overlay-right">
          <h2>Hello, Friend</h2>
          <button id="signUp" className="overlay_btn" onClick={() => setIsRightPanelActive(true)}>Sign Up</button>
          <button id="resetPassword" className="overlay_btn" onClick={() => goToResetPassword()}>Find my Password</button>
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;