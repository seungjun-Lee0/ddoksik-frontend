import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AccountContext } from '../../Context/Account';
import UserPool from '../../Context/UserPool';
import { fetchUserHealthProfile } from '../../services/HealthProfileService';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRightPanelActive, setIsRightPanelActive] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState('');
  const [activeTab, setActiveTab] = useState('login'); // 초기 값으로 'login' 탭을 활성화

  const [name, setName] = useState('');

  const navigate = useNavigate();

  const { authenticate, signUp } = useContext(AccountContext);

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const onSubmitLogin = async (e) => {
    e.preventDefault();
    
    authenticate(email, password)
    .then(data => {
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
        alert('아이디 혹은 비밀번호가 일치하지 않습니다.');
    })
  };

  const onSubmitRegister = async (e) => {
    e.preventDefault();

    signUp(email, name, password).then(data => {
      console.log("registered Successfully", data)
      alert('회원가입이 완료되었습니다.');
    })
    .catch(err => {
      console.log("Failed to register", err);
      alert('회원가입에 실패하였습니다.');
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
            alert('인증번호 발송에 실패하였습니다.');
            return;
        }
        console.log(result); // 'SUCCESS'를 기대합니다.
        alert('인증번호가 발송되었습니다.');
        navigate('/home'); // 이메일 확인 후 홈 페이지로 이동
    });
  };
  
  const goToResetPassword = () => {
    navigate('/reset-password');
  }

  return (
    <div className='login-container'>
      <div className="form-wrap">
        <div className="tabs">
          <h3 className={`signup-tab ${activeTab === 'signup' ? 'active' : ''}`} onClick={() => handleTabClick('signup')}>
            <a>Sign Up</a>
          </h3>
          <h3 className={`login-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => handleTabClick('login')}>
            <a>Login</a>
          </h3>
        </div>

        <div className="tabs-content">
          <div id="signup-tab-content" className={`tab-content ${activeTab === 'signup' ? 'active' : ''}`}>
            <form onSubmit={onSubmitRegister}>
              <h1>Create Account</h1>
            
              <input
              className='input'
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              className='input'
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className='input'
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              className='input'
              type="text"
              placeholder="Confirmation Code"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
            />

            <button type="submit" className="button">CONFIRMATION CODE</button>
            <button type="button" onClick={confirmRegistration} className="button">REGISTER</button>
            </form>
            <div className="help-text">
              <p>By signing up, you agree to our</p>
              <p><a href="#">Terms of service</a></p>
            </div>
          </div>

          <div id="login-tab-content" className={`tab-content ${activeTab === 'login' ? 'active' : ''}`}>
            <form onSubmit={onSubmitLogin}>
              <h1>Sign In</h1>
              
              <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <input className="input" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}/>
              <button type="submit" className="button">LOGIN</button>
            </form>
            <div className="help-text">
              <p><a onClick={goToResetPassword}>Forget your password?</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;