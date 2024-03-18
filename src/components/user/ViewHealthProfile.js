import React, { useEffect, useState, useContext } from 'react';
import { fetchUserHealthProfile, fetchUserDailyCalories } from '../../services/HealthProfileService'; // 서비스에서 fetchUserHealthProfile 함수 임포트
import { getDailyNutritionTotals } from '../../services/DietService';

import { AccountContext } from '../../Context/Account';

function ViewHealthProfile() {
  const [healthProfile, setHealthProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [targetKcal, setTargetKcal] = useState(0);
  const [targetNutrients,setTargetNutrients] = useState(0);
  const [nutritionTotals,setNutritionTotals] = useState(0);
  

  const { getSession } = useContext(AccountContext);

  useEffect(() => {
      getSession().then(async (session) => {
        try {
          const userHealthProfile = await fetchUserHealthProfile(session.user.username, session.idToken.jwtToken);
          setName(session.name);
          setEmail(session.email);
          setHealthProfile(userHealthProfile);
        } catch (error) {
          console.error('Failed to fetch health profile:', error);
          window.location.reload();
          // alert('Failed to fetch health profile.');
        }

        try{
        const dailyNutritionTotals = await getDailyNutritionTotals(session.user.username, session.idToken.jwtToken);
        setNutritionTotals(dailyNutritionTotals);
        }catch (error) {
          console.error('Failed to fetch daily nutrition totals:', error);
          alert('Failed to fetch daily nutrition totals.');
        }
        
        try{
          const targetNutritionTotals = await fetchUserDailyCalories(session.user.username, session.idToken.jwtToken);          
          setTargetKcal(targetNutritionTotals.daily_calories);
          setTargetNutrients(targetNutritionTotals.nutrients);
        }catch(error){
          console.error('Failed to fetch daily calories:', error);
          alert('Failed to fetch daily calories.');
        }
      });
  }, []);

  if (!healthProfile) return <div>Loading health profile...</div>;
  
  return (
    <div className='user-profile-container'>
      <div className="user-profile-box">
      <div className="user-profile-area">
        <div className="side-wrapper">
        <div className="user-profile">
          <img src="https://media.istockphoto.com/id/1298261537/ko/%EB%B2%A1%ED%84%B0/%EB%B9%88-%EB%82%A8%EC%9E%90-%ED%94%84%EB%A1%9C%ED%95%84-%ED%97%A4%EB%93%9C-%EC%95%84%EC%9D%B4%EC%BD%98-%EC%9E%90%EB%A6%AC-%ED%91%9C%EC%8B%9C%EC%9E%90.jpg?s=612x612&w=0&k=20&c=VHjQezraQSVaZu9VFepBGzAYMsvD0XoMRpXAmx46qWk=" alt="" className="user-photo" />
          <div className="user-name">{name}</div>
          <div className="user-mail">{email}</div>
        </div>
        <div className="user-notification">
          <div className="notify">
            <a href='/health-profile'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
              <p className='user-profile-text'>프로필 편집</p>
            </a>
          </div>
          <div className="notify">
            <a href='/settings'>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" fill="currentColor">
                <path d="M13.533 5.6h-.961a.894.894 0 01-.834-.57.906.906 0 01.197-.985l.675-.675a.466.466 0 000-.66l-1.32-1.32a.466.466 0 00-.66 0l-.676.677a.9.9 0 01-.994.191.906.906 0 01-.56-.837V.467A.467.467 0 007.933 0H6.067A.467.467 0 005.6.467v.961c0 .35-.199.68-.57.834a.902.902 0 01-.983-.195L3.37 1.39a.466.466 0 00-.66 0L1.39 2.71a.466.466 0 000 .66l.675.675c.25.25.343.63.193.995a.902.902 0 01-.834.56H.467A.467.467 0 000 6.067v1.866c0 .258.21.467.467.467h.961c.35 0 .683.202.834.57a.904.904 0 01-.197.984l-.675.676a.466.466 0 000 .66l1.32 1.32a.466.466 0 00.66 0l.68-.68a.894.894 0 01.994-.187.897.897 0 01.556.829v.961c0 .258.21.467.467.467h1.866c.258 0 .467-.21.467-.467v-.961c0-.35.202-.683.57-.834a.904.904 0 01.984.197l.676.675a.466.466 0 00.66 0l1.32-1.32a.466.466 0 000-.66l-.68-.68a.894.894 0 01-.187-.994.897.897 0 01.829-.556h.961c.258 0 .467-.21.467-.467V6.067a.467.467 0 00-.467-.467zM7 9.333C5.713 9.333 4.667 8.287 4.667 7S5.713 4.667 7 4.667 9.333 5.713 9.333 7 8.287 9.333 7 9.333z" />
              </svg>
              <p className='user-profile-text'>사용자 설정</p>
            </a>
          </div>
        </div>
        </div>
        <div className='side-wrapper'>
        <div className="project-title">내 정보</div>
          <div className="task-explanation"></div>
          <div className="task-status">
            <div className="task-stat">
              <div className="task-number">
                {healthProfile.height}
              </div>
              <div className="task-condition">키 (cm)</div>
            </div>
            <div className="task-stat">
              <div className="task-number">
                {healthProfile.weight}
              </div>
              <div className="task-condition">몸무게 (kg)</div>
            </div>
            <div className="task-stat">
              <div className="task-number">
                {(healthProfile.weight / ((healthProfile.height / 100) ** 2)).toFixed(1)}
              </div>
              <div className="task-condition">BMI 지수</div>
            </div>
          </div>
        </div>
        <div className="side-wrapper">
        <div className="project-title">나의 알러지 유형</div>
        <div className="project-name">
          {
            healthProfile.allergy_intolerance_type.map((type) => {
              let departmentName;
              switch (type) {
                case 'seafood':
                  departmentName = '해산물';
                  break;
                case 'dairy':
                  departmentName = '유제품';
                  break;
                case 'nut':
                  departmentName = '견과류';
                  break;
                // 다른 알레르기 유형에 대한 케이스 추가 가능
                default:
                  departmentName = null; // 알려지지 않은 유형은 무시
              }
              return departmentName ? <div className="project-department" key={type}>{departmentName}</div> : null;
            })
          }
        </div>

        </div>
        {/* <div className="side-wrapper">
        <div className="project-title">Team</div>
        <div className="team-member">
          <img src="https://images.unsplash.com/flagged/photo-1574282893982-ff1675ba4900?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1000&q=80" alt="" className="members" />
          <img src="https://assets.codepen.io/3364143/Screen+Shot+2020-08-01+at+12.24.16.png" alt="" className="members" />
          <img src="https://images.unsplash.com/flagged/photo-1570612861542-284f4c12e75f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60" alt="" className="members" />
          <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=998&q=80" alt="" className="members" />
          <img src="https://images.unsplash.com/photo-1541647376583-8934aaf3448a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80" alt="" className="members" />
        </div>
        </div> */}
      </div>
      </div>
    </div> 
    
  );
}

export default ViewHealthProfile;