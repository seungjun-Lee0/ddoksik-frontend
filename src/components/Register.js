import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CognitoUser } from 'amazon-cognito-identity-js';
import { AccountContext } from '../Context/Account';
import UserPool from '../Context/UserPool';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const { signUp } = useContext(AccountContext);

  const onSubmit = async (e) => {
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

  return (
    <form onSubmit={onSubmit}>
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
      <button type="button" onClick={confirmRegistration}>Confirm Registration</button>
      <button type="submit">Register</button>
    </form>
  );
}

export default Register;
