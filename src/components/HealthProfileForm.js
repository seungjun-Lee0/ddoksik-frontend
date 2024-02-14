import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserHealthProfile, updateUserHealthProfile } from '../services/HealthProfileService';
import '../assets/css/healthProfileForm.css';

function HealthProfileForm({ userId, token, hasProfile }) {
  const navigate = useNavigate();
  const [allergyIntoleranceType, setAllergyIntoleranceType] = useState({
    dairy: false,
    nut: false,
    seafood: false,
  });
  const [dietPreference, setDietPreference] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [profileExists, setProfileExists] = useState(hasProfile);

  useEffect(() => {
    if (!profileExists) {
      fetchUserHealthProfile(userId, token)
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setProfileExists(true);
            const allergies = data.allergy_intolerance_type.reduce((acc, allergy) => {
              acc[allergy] = true;
              return acc;
            }, { dairy: false, nut: false, seafood: false });
            setAllergyIntoleranceType(allergies);
            setDietPreference(data.diet_preference);
            setBirthDate(data.birth_date);
            setAge(data.age);
            setGender(data.gender);
            setHeight(data.height);
            setWeight(data.weight);
            setTargetWeight(data.target_weight);
          }
        })
        .catch((error) => {
          console.error('Error fetching user health profile:', error);
        });
    }
  }, [userId, token, profileExists]);

  const handleAllergyChange = (e) => {
    const { name, checked } = e.target;
    setAllergyIntoleranceType(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedAllergies = Object.entries(allergyIntoleranceType)
      .filter(([_, isChecked]) => isChecked)
      .map(([allergy]) => allergy);
    const profileData = {
      allergy_intolerance_type: selectedAllergies,
      diet_preference: dietPreference,
      birth_date: birthDate,
      age: parseInt(age, 10),
      gender: gender,
      height: parseFloat(height),
      weight: parseFloat(weight),
      target_weight: parseFloat(targetWeight),
    };

    try {
      await updateUserHealthProfile(userId, token, profileData, profileExists);
      alert('Health profile updated successfully.');
      navigate('/');
    } catch (error) {
      console.error('Failed to update health profile:', error);
      alert('Failed to update health profile.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          <input type="checkbox" name="dairy" checked={allergyIntoleranceType.dairy} onChange={handleAllergyChange} /> Dairy
        </label>
        <label>
          <input type="checkbox" name="nut" checked={allergyIntoleranceType.nut} onChange={handleAllergyChange} /> Nut
        </label>
        <label>
          <input type="checkbox" name="seafood" checked={allergyIntoleranceType.seafood} onChange={handleAllergyChange} /> Seafood
        </label>
      </div>
      <select value={dietPreference || ''} onChange={(e) => setDietPreference(e.target.value)}>
        <option value="">Select Diet Preference</option>
        <option value="lose_weight">Lose Weight</option>
        <option value="maintain_weight">Maintain Weight</option>
        <option value="gain_weight">Gain Weight</option>
      </select>
      <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="Birth Date" />
      <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" />
      <select value={gender} onChange={(e) => setGender(e.target.value)}>
        <option value="">Select Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="Height (cm)" />
      <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" />
      <input type="number" value={targetWeight} onChange={(e) => setTargetWeight(e.target.value)} placeholder="Target Weight (kg)" />
      
      <button type="submit">Submit Health Profile</button>
    </form>
  );
}

export default HealthProfileForm;
