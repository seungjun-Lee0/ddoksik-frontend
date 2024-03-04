import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserHealthProfile } from '../../services/HealthProfileService'; // 서비스에서 fetchUserHealthProfile 함수 임포트

import { AccountContext } from '../../Context/Account';

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
    <div className='profile-container'>
      <div className="profile-box">

      <h1 className="title">Health Profile</h1>

      <div className="grid">
        <div className="form-group">
        <div className="checkbox-group">
              <legend className="checkbox-group-legend">Choose your Goal</legend>
              <div className="checkbox">
                <label className="checkbox-wrapper">
                <input
                  className='checkbox-input'
                  type="checkbox"
                  checked={healthProfile.diet_preference === "lose_weight"}
                  readOnly
                />
                  <span className="checkbox-tile">
                    <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-down" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"/>
                    </svg>
                    </span>
                    <span className="checkbox-label">Lose Weight</span>
                  </span>
                </label>
              </div>
              <div className="checkbox">
                <label className="checkbox-wrapper">
                <input
                  className='checkbox-input'
                  type="checkbox"
                  value="maintain_weight"
                  checked={healthProfile.diet_preference === "maintain_weight"}
                  readOnly
                />            
                  <span className="checkbox-tile">
                    <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash-circle" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/>
                    </svg>
                    </span>
                    <span className="checkbox-label">Maintain Weight</span>
                  </span>
                </label>
              </div>
              <div className="checkbox">
                <label className="checkbox-wrapper">
                <input
                  className='checkbox-input'
                  type="checkbox"
                  value="gain_weight"
                  checked={healthProfile.diet_preference === "gain_weight"}
                  readOnly
                />          
                  <span className="checkbox-tile">
                    <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-up" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5m-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5"/>
                    </svg>
                    </span>
                    <span className="checkbox-label">Gain Weight</span>
                  </span>
                </label>
              </div>
          </div>
        </div>

        <div className="form-group ">
          <label htmlFor="phone">age</label>
          <input type="number" value={healthProfile.age} placeholder="Age" readOnly/>
        </div>

        <div className="form-group">
          <label htmlFor="height">Height</label>
          <input type="number" value={healthProfile.height} placeholder="Height (cm)" readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="weight">Weight</label>
          <input type="number" value={healthProfile.weight} placeholder="Weight (kg)" readOnly />          
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <legend className="checkbox-group-legend">your Gender</legend>
            <div className="checkbox">
              <label className="checkbox-wrapper">
                <input className="checkbox-input" type="checkbox" checked={healthProfile.gender === "male"} readOnly />
                <span className="checkbox-tile">
                  <span className="checkbox-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gender-male" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M9.5 2a.5.5 0 0 1 0-1h5a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-1 0V2.707L9.871 6.836a5 5 0 1 1-.707-.707L13.293 2zM6 6a4 4 0 1 0 0 8 4 4 0 0 0 0-8"/>
                  </svg>
                  </span>
                  <span className="checkbox-label">Male</span>
                </span>
              </label>
            </div>
            <div className="checkbox">
              <label className="checkbox-wrapper">
              <input className="checkbox-input" type="checkbox" checked={healthProfile.gender === "female"} readOnly />
                <span className="checkbox-tile">
                  <span className="checkbox-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-gender-female" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1a4 4 0 1 0 0 8 4 4 0 0 0 0-8M3 5a5 5 0 1 1 5.5 4.975V12h2a.5.5 0 0 1 0 1h-2v2.5a.5.5 0 0 1-1 0V13h-2a.5.5 0 0 1 0-1h2V9.975A5 5 0 0 1 3 5"/>
                  </svg>
                  </span>
                  <span className="checkbox-label">Female</span>
                </span>
              </label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
              <legend className="checkbox-group-legend">Activity Level</legend>
              <div className="checkbox">
                <label className="checkbox-wrapper">
                <input
                className='checkbox-input'
                type="checkbox"
                checked={healthProfile.activityLevel === 1.2}
                readOnly />
                  <span className="checkbox-tile">
                    <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-frown" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
                    </svg>
                    </span>
                    <span className="checkbox-label">비활동적</span>
                  </span>
                </label>
              </div>
              <div className="checkbox">
                <label className="checkbox-wrapper">
                <input
                className='checkbox-input'
                type="checkbox"
                value="1.55"
                checked={healthProfile.activity_level === 1.55}
                readOnly
                />                
                  <span className="checkbox-tile">
                    <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-neutral" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M4 10.5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 0-1h-7a.5.5 0 0 0-.5.5m3-4C7 5.672 6.552 5 6 5s-1 .672-1 1.5S5.448 8 6 8s1-.672 1-1.5m4 0c0-.828-.448-1.5-1-1.5s-1 .672-1 1.5S9.448 8 10 8s1-.672 1-1.5"/>
                    </svg>
                    </span>
                    <span className="checkbox-label">활동적</span>
                  </span>
                </label>
              </div>
              <div className="checkbox">
                <label className="checkbox-wrapper">
                <input
                className='checkbox-input'
                type="checkbox"
                value="1.9"
                checked={healthProfile.activity_level === 1.725}/>             
                  <span className="checkbox-tile">
                    <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-emoji-smile" viewBox="0 0 16 16">
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                      <path d="M4.285 9.567a.5.5 0 0 1 .683.183A3.5 3.5 0 0 0 8 11.5a3.5 3.5 0 0 0 3.032-1.75.5.5 0 1 1 .866.5A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1-3.898-2.25.5.5 0 0 1 .183-.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5"/>
                    </svg>
                    </span>
                    <span className="checkbox-label">매우 활동적</span>
                  </span>
                </label>
              </div>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <legend className="checkbox-group-legend">Allergy Intolerance Type</legend>
            <div className="checkbox">
              <label className="checkbox-wrapper">
                <input
                  className="checkbox-input"
                  type="checkbox"
                  name="dairy"
                  checked={healthProfile.allergy_intolerance_type.includes('dairy')}
                  readOnly
                /> 
                <span className="checkbox-tile">
                  <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                      <rect width="256" height="256" fill="none"></rect>
                      <circle cx="96" cy="144.00002" r="10"></circle>
                      <circle cx="160" cy="144.00002" r="10"></circle>
                      <path d="M74.4017,80A175.32467,175.32467,0,0,1,128,72a175.32507,175.32507,0,0,1,53.59754,7.99971" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></path>
                      <path d="M181.59717,176.00041A175.32523,175.32523,0,0,1,128,184a175.32505,175.32505,0,0,1-53.59753-7.99971" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></path>
                      <path d="M155.04392,182.08789l12.02517,24.05047a7.96793,7.96793,0,0,0,8.99115,4.20919c24.53876-5.99927,45.69294-16.45908,61.10024-29.85086a8.05225,8.05225,0,0,0,2.47192-8.38971L205.65855,58.86074a8.02121,8.02121,0,0,0-4.62655-5.10908,175.85294,175.85294,0,0,0-29.66452-9.18289,8.01781,8.01781,0,0,0-9.31925,5.28642l-7.97318,23.91964" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></path>
                      <path d="M100.95624,182.08757l-12.02532,24.0508a7.96794,7.96794,0,0,1-8.99115,4.20918c-24.53866-5.99924-45.69277-16.459-61.10006-29.85069a8.05224,8.05224,0,0,1-2.47193-8.38972L50.34158,58.8607a8.0212,8.0212,0,0,1,4.62655-5.1091,175.85349,175.85349,0,0,1,29.66439-9.18283,8.0178,8.0178,0,0,1,9.31924,5.28642l7.97318,23.91964" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></path>
                    </svg>
                  </span>
                  <span className="checkbox-label">Dairy</span>
                </span>
              </label>
            </div>
            <div className="checkbox">
              <label className="checkbox-wrapper">
                <input
                  className="checkbox-input"
                  type="checkbox"
                  name="nut"
                  checked={healthProfile.allergy_intolerance_type.includes('nut')}
                  readOnly
                /> 
                <span className="checkbox-tile">
                  <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-nut" viewBox="0 0 16 16">
                      <path d="m11.42 2 3.428 6-3.428 6H4.58L1.152 8 4.58 2zM4.58 1a1 1 0 0 0-.868.504l-3.428 6a1 1 0 0 0 0 .992l3.428 6A1 1 0 0 0 4.58 15h6.84a1 1 0 0 0 .868-.504l3.429-6a1 1 0 0 0 0-.992l-3.429-6A1 1 0 0 0 11.42 1z"/>
                      <path d="M6.848 5.933a2.5 2.5 0 1 0 2.5 4.33 2.5 2.5 0 0 0-2.5-4.33m-1.78 3.915a3.5 3.5 0 1 1 6.061-3.5 3.5 3.5 0 0 1-6.062 3.5z"/>
                    </svg>
                  </span>
                  <span className="checkbox-label">Nut</span>
                </span>
              </label>
            </div>
            <div className="checkbox">
              <label className="checkbox-wrapper">
                <input
                  className="checkbox-input"
                  type="checkbox"
                  name="seafood"
                  checked={healthProfile.allergy_intolerance_type.includes('seafood')}
                  readOnly
                /> 
                <span className="checkbox-tile">
                  <span className="checkbox-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" fill="currentColor" viewBox="0 0 256 256">
                      <rect width="256" height="256" fill="none"></rect>
                      <polygon points="72 40 184 40 240 104 128 224 16 104 72 40" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></polygon>
                      <polygon points="177.091 104 128 224 78.909 104 128 40 177.091 104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></polygon>
                      <line x1="16" y1="104" x2="240" y2="104" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="12"></line>
                    </svg>
                  </span>
                  <span className="checkbox-label">Seafood</span>
                </span>
              </label>
            </div>
          </div>
        </div>

      </div>

      
      <div className="button-container">
        <button className="form-button" onClick={() => navigate(`/health-profile`)}>Edit Health Profile</button>
      </div>
      </div>
    </div> 
    
  );
}

export default ViewHealthProfile;