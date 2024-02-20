import React, { useState } from 'react';
import { CognitoUser } from 'amazon-cognito-identity-js';
import UserPool from '../Context/UserPool';
import { useNavigate } from 'react-router-dom';

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [stage, setStage] = useState(1); // 1: Email 입력, 2: 인증 코드 및 새 비밀번호 입력
    const navigate = useNavigate();

    const requestPasswordReset = () => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        cognitoUser.forgotPassword({
            onSuccess: (data) => {
                console.log('Password reset code sent.', data);
                setStage(2);
            },
            onFailure: (err) => {
                console.error('Password reset request failed', err);
            },
        });
    };

    const resetPassword = () => {
        const cognitoUser = new CognitoUser({
            Username: email,
            Pool: UserPool,
        });

        cognitoUser.confirmPassword(verificationCode, newPassword, {
            onSuccess: () => {
                console.log('Password reset successful');
                navigate('/login');
            },
            onFailure: (err) => {
                console.error('Password reset failed', err);
            },
        });
    };

    return (
        <div>
            {stage === 1 && (
                <div>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
                    <button onClick={requestPasswordReset}>Send Verification Code</button>
                </div>
            )}
            {stage === 2 && (
                <div>
                    <input type="text" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} placeholder="Verification Code" />
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                    <button onClick={resetPassword}>Reset Password</button>
                </div>
            )}
        </div>
    );
};

export default PasswordReset;
