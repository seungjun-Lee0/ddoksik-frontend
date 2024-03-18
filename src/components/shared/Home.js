import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from "../../Context/Account";
import { fetchUserDailyCalories, fetchRecommendedDiet } from '../../services/HealthProfileService'; // 서비스에서 fetchUserHealthProfile 함수 임포트
import { getDailyNutritionTotals } from '../../services/DietService';
import { verifyTokenWithBackend } from "../../services/AuthService";
import WeeklyCharts from '../diet/WeeklyCharts';

export default function Home() {
  const { getSession, logout } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState(false); // Loading state added

  const [recommendedDiet, setRecommendedDiet] = useState(null); 

  const [targetKcal, setTargetKcal] = useState(0);
  const [targetNutrients,setTargetNutrients] = useState(0);
  const [nutritionTotals,setNutritionTotals] = useState(0);
  
  const [showDetails, setShowDetails] = useState(false); // 추가: 추천 식단 세부 정보 표시 상태


  useEffect(() => {
      getSession().then(async (session) => {
        setIsLoading(true)
        try{
          verifyTokenWithBackend(session.idToken.jwtToken);
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

          try{
            const dietDetails = await fetchRecommendedDiet(session.user.username, session.idToken.jwtToken);
            setRecommendedDiet(dietDetails);
          }catch(error){
            console.error('Failed to fetch recommended diet:', error);
            alert('추천 식단을 가져오는 데 실패했습니다.');
          }
      }catch(error){
        alert('세션이 만료되었습니다. 다시 로그인 해주세요.');
        logout();
      } 
      finally {
        setIsLoading(false);
      }
    });
  }, []);

  const dietDescription = recommendedDiet && Object.keys(recommendedDiet).length > 0
    ? renderDietTypeDescription(Object.values(recommendedDiet)[0][0].diet_type)
    : null;
  
  
  if(isLoading){
    return (<div><div className="loading">Loading&#8230;</div></div>);
  }
    return (
      <div className="wrapper">
        <div className="main-wrapper">
          <div className='home-wrapper'>
            <div className="home-project-title">주별 칼로리 섭취량 비교</div>
            <WeeklyCharts />
          </div>

          <div className='home-wrapper'>
            <div className="home-project-title">오늘의 영양 섭취</div>
            <div className="task-explanation">목표 칼로리</div>
            <div className="progress-status">{nutritionTotals.my_total_calories} / {targetKcal} (kcal)</div>
            <div className="progress">
              <div
                className="progress-bar"
                style={{
                  width: `${Math.min(100, (nutritionTotals.my_total_calories / targetKcal) * 100)}%`,
                  backgroundColor: (nutritionTotals.my_total_calories / targetKcal) <= 0.5
                  ? 'grey'
                  : (nutritionTotals.my_total_calories / targetKcal) <= 1
                  ? 'darkseagreen'
                  : 'indianred'
                }}
              ></div>
            </div>
            <div className="progress-percentage">
              {`${Math.round((nutritionTotals.my_total_calories / targetKcal) * 100)}%`}
            </div>
            <div className="home-task-explanation">
                <div className="home-task-condition">
                  목표치보다 {Math.abs((targetKcal - nutritionTotals.my_total_calories))} kcal 
                  {nutritionTotals.my_total_calories > targetKcal ? ' 초과' : ' 미달'}
                </div>
            </div>
            <div className="home-task-status">
              <div className="home-task-stat">
              <div className="home-task-number">
                {targetNutrients.carbohydrates > 0 ? 
                `${Math.round((nutritionTotals.my_total_carbohydrates / targetNutrients.carbohydrates) * 100)}%` :
                '0%'}
              </div>
              <div className="home-task-condition">탄수화물</div>
              <div className="home-task-tasks">{nutritionTotals.my_total_carbohydrates} / {targetNutrients.carbohydrates} (g)</div>
              </div>
              <div className="home-task-stat">
              <div className="home-task-number">
                {targetNutrients.proteins > 0 ? 
                `${Math.round((nutritionTotals.my_total_protein / targetNutrients.proteins) * 100)}%` :
                '0%'}
              </div>
              <div className="home-task-condition">단백질</div>
              <div className="home-task-tasks">{nutritionTotals.my_total_protein} / {targetNutrients.proteins} (g)</div>
              </div>
              <div className="home-task-stat">
              <div className="home-task-number">
                {targetNutrients.fats > 0 ? 
                `${Math.round((nutritionTotals.my_total_fat / targetNutrients.fats) * 100)}%` :
                '0%'}
              </div>
              <div className="home-task-condition">지방</div>
              <div className="home-task-tasks">{nutritionTotals.my_total_fat} / {targetNutrients.fats} (g)</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className='home-wrapper-half'>
          <div className="home-project-title">맞춤형 추천 식단</div>
          {/* 추천 식단 유형 설명이 여기에 표시됩니다 */}
          {dietDescription && (
            <div className="home-task-recommendation">
              {dietDescription}
            </div>
          )}
          {/* 버튼을 누르면 showDetails 상태를 토글합니다 */}
          <button className="home-task-recommendation-button" onClick={() => setShowDetails(!showDetails)}>
            {showDetails ? '닫기' : '식단 보기'}
          </button>
        </div>

        <div className='home-wrapper-half-small'>
          <div className="home-project-title">식단 추가</div>
          <a href="/meal-type-select">
            <div className="home-task-button">
              <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
              </svg>
            </div>
          </a>
        </div>
                   
        {showDetails && recommendedDiet && (
          <RenderDietPlan dietData={recommendedDiet} />
        )}
      </div>
      
    );
  }
  
  function renderDietTypeDescription(dietType) {
    if (dietType === "high-c, high-p") {
      return "고칼로리, 고단백 식단 유형";
    }
    else if (dietType === "high-c, high-n") {
      return "고칼로리, 고단백 식단 유형";
    }
    else if (dietType === "medium-c, high-p") {
      return "중등도 칼로리, 고단백 식단 유형";
    }
    else if (dietType === "medium-c") {
      return "균형 잡힌 영양 식단 유형";
    }
    else if (dietType === "low-c, high-f") {
      return "저칼로리, 고섬유질 식단 유형";
    }
    else{
      return "고칼로리, 영양 식단 유형"
    }
    // 추가적인 식단 유형에 대한 설명을 여기에 추가할 수 있습니다
  }

  function RenderDietPlan({ dietData }) {
    return (
      <div className='home-wrapper home-animation'>
        <div className="home-project-title">식단 정보</div>

        {Object.entries(dietData).map(([mealType, meals]) => (
          <div className='home-task-card' key={mealType}>
            <div className="task-explanation">{mealType.charAt(0).toUpperCase() + mealType.slice(1)}</div>
            {meals.map(meal => (
              <div key={meal.id}>
                  <div className="search-content-list">
                    <button className="detail-button">
                      <p>{meal.food_info}</p>
                    </button>
                  </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }