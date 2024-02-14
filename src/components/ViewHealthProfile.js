import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserHealthProfile } from '../services/HealthProfileService'; // 서비스에서 fetchUserHealthProfile 함수 임포트

function ViewHealthProfile({ userId, token }) {
  const [healthProfile, setHealthProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await fetchUserHealthProfile(userId, token);
        setHealthProfile(data);
      } catch (error) {
        console.error('Failed to fetch health profile:', error);
        alert('Failed to fetch health profile.');
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (!healthProfile) return <div>Loading health profile...</div>;

  return (
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
      <button onClick={() => navigate(`/health-profile/edit`)}>Edit Health Profile</button>
    </div>
  );
}

export default ViewHealthProfile;