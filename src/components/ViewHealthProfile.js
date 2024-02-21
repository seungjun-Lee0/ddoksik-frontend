import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserHealthProfile } from '../services/HealthProfileService'; // 서비스에서 fetchUserHealthProfile 함수 임포트

import { AccountContext } from '../Context/Account';
import '../assets/css/profile.css';

function ViewHealthProfile() {
  const [healthProfile, setHealthProfile] = useState(null);
  const navigate = useNavigate();

  const { getSession } = useContext(AccountContext);

  useEffect(() => {
      getSession().then((session) => {
        const fetchProfile = async () => {
          try {
            const data = await fetchUserHealthProfile(session.user.username, session.idToken.jwtToken);
            setHealthProfile(data);
          } catch (error) {
            console.error('Failed to fetch health profile:', error);
            alert('Failed to fetch health profile.');
          }
        };
        fetchProfile();
      });
  }, []);

  if (!healthProfile) return <div>Loading health profile...</div>;

  return (
    // <div className="profile">
    //   <div className="profile-header">
    //     <div className="profile-picture">
    //       {/* Placeholder for profile picture */}
    //     </div>
    //     <div className="user-stats">
    //       <div className="stat">
    //         <span className="stat-label">몸무게</span>
    //         <span className="stat-value">{userStats.weight}</span>
    //       </div>
    //       <div className="stat">
    //         <span className="stat-label">칼로리</span>
    //         <span className="stat-value">{userStats.calorieIntake}</span>
    //       </div>
    //       <div className="stat">
    //         <span className="stat-label">운동시간</span>
    //         <span className="stat-value">{userStats.exerciseTime}</span>
    //       </div>
    //     </div>
    //   </div>
    //   <div className="user-name">
    //     {userName}
    //   </div>
    // </div>

    <div>
      <h2>Health Profile</h2>
      <p>Allergy Intolerance Type: {healthProfile.allergy_intolerance_type.join(', ')}</p>
      <p>Diet Preference: {healthProfile.diet_preference}</p>
      <p>Birth Date: {healthProfile.birth_date}</p>
      <p>Age: {healthProfile.age}</p>
      <p>Gender: {healthProfile.gender}</p>
      <p>Height: {healthProfile.height} cm</p>
      <p>Weight: {healthProfile.weight} kg</p>
      <p>Target Weight: {healthProfile.target_weight} kg</p>
      <button onClick={() => navigate(`/health-profile`)}>Edit Health Profile</button>
    </div>
  );
}

export default ViewHealthProfile;