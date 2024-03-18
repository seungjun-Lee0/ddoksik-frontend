import React, { useEffect, useContext, useState } from "react";
import { AccountContext } from "../../Context/Account";
import { verifyTokenWithBackend } from "../../services/AuthService";
import EditMealPlanModal from "../diet/EditMealPlanModal";
import AddFoodButton from "../diet/AddFoodButton";
import { handleSaveMealPlan } from "../../services/DietService";
import { BASIC_URL } from "../../services/DietService";

export default function DietPlans() {
  const { getSession } = useContext(AccountContext);
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [groupedDiets, setGroupedDiets] = useState({}); // 그룹화된 식단 정보를 저장할 상태
  const [currentMealPlan, setCurrentMealPlan] = useState(null);
  const [visibleMenu, setVisibleMenu] = useState({}); // 메뉴 보이기/숨기기 상태 관리를 위한 상태
  const [visibleMenu2, setVisibleMenu2] = useState({}); // 메뉴 보이기/숨기기 상태 관리를 위한 상태
  const [sortOrder, setSortOrder] = useState('newest'); // 정렬 순서 상태
  const [dietCount, setDietCount] = useState(0); // 식단 총 개수
  
  useEffect(() => {
      getSession().then((session) => {
        verifyTokenWithBackend(session.idToken.jwtToken);
        setUsername(session.user.username);
        setToken(session.idToken.jwtToken);
        try {
          verifyTokenWithBackend(session.idToken.jwtToken).then(() => {
            fetch(`${BASIC_URL}/diets/${session.user.username}/meal-plans/grouped`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${session.idToken.jwtToken}`,
              },
            })
            .then(response => response.json())
            .then(data => {
              const sortedData = { ...data.grouped_meal_plans };
              // 날짜 키를 기준으로 내림차순 정렬
              const sortedDates = Object.keys(sortedData).sort((a, b) => new Date(b) - new Date(a));
              // 정렬된 날짜를 기준으로 새로운 객체 생성
              const newGroupedDiets = {};
              sortedDates.forEach(date => {
                newGroupedDiets[date] = sortedData[date];
              });
              setGroupedDiets(newGroupedDiets); // 정렬된 데이터를 상태에 저장
            })
            .catch(error => console.log(error));
          });
        } catch (err) {
          console.log("Access Token has expired.");
          window.location.href = '/login';
        }
    });
  }, []);

  useEffect(() => {
    // 식단 총 개수 계산
    const totalDiets = Object.values(groupedDiets).length;
    setDietCount(totalDiets);
  }, [groupedDiets]);
  

  const toggleSortOrder = () => {
    setSortOrder(prevSortOrder => prevSortOrder === 'newest' ? 'oldest' : 'newest');
  };

  useEffect(() => {
    // 정렬 로직
    const sortedData = { ...groupedDiets };
    const sortedDates = Object.keys(sortedData).sort((a, b) => sortOrder === 'newest' ? new Date(b) - new Date(a) : new Date(a) - new Date(b));
    const newGroupedDiets = {};
    sortedDates.forEach(date => {
      newGroupedDiets[date] = sortedData[date];
    });
    setGroupedDiets(newGroupedDiets);
  }, [sortOrder]);

  // 메뉴 보이기/숨기기 상태를 토글하는 함수
  const toggleMenuVisibility = (date) => {
    setVisibleMenu(false);
    setVisibleMenu2(false);
    setVisibleMenu(prev => ({
      ...prev,
      [date]: !prev[date]
    }));
  };

  const handleEditClick = (mealPlan, mealId) => {
    setVisibleMenu2(false);
    setCurrentMealPlan(mealPlan);
    // setIsEditModalOpen(true);
    setVisibleMenu2(prev => ({
      ...prev,
      [mealId]: !prev[mealId]
    }));
  };

  const closeMenuClick = () => {
    setVisibleMenu(false);
  }

  const closeEditClick = () => {
    setVisibleMenu2(false);
  }

  const handleDeleteMealPlan = async (mealId) => {
    if (window.confirm("식단에서 제외 하시겠습니까?")) {
      try {
        const response = await fetch(`${BASIC_URL}/meal-plans/${mealId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const newGroupedDiets = { ...groupedDiets };
          Object.entries(newGroupedDiets).forEach(([date, mealTypes]) => {
            Object.keys(mealTypes).forEach((mealType) => {
              newGroupedDiets[date][mealType] = newGroupedDiets[date][mealType].filter(meal => meal.id !== mealId);
            });
          });
          setGroupedDiets(newGroupedDiets);
          alert("삭제되었습니다.");
        } else {
          alert("이미 삭제되었거나 삭제가 불가능한 요청입니다.");
        }
      } catch (error) {
        console.error("Failed to delete the meal plan:", error);
      }
    }
  };
  
  
    return (
    <div className="wrapper">
      {/* <div className="search-menu">
        <div className="search-bar">
        <input type="text" className="search-box" autoFocus />
        <div className="search item">Breakfast
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
          <path d="M18 6L6 18M6 6l12 12" /></svg>
        </div>
        <div className="search item">Lunch
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="feather feather-x">
          <path d="M18 6L6 18M6 6l12 12" /></svg>
        </div>
        </div>
        <button className="search-button">Find My Diet</button>
      </div> */}
      <div className="main-container">
        <div className="searched-jobs">
          <div className="searched-bar">
            <div className="searched-show">Showing {dietCount} Diets</div>
            <div className="searched-sort" onClick={toggleSortOrder}>
              Sort by: <span className="post-time">{sortOrder === 'newest' ? '최신순 ▼' : '오래된순 ▲'} </span>
            </div>
          </div>
          
            <div className="job-cards" > {/* 날짜를 기반으로 한 고유한 key 설정 */}
            {Object.entries(groupedDiets).map(([date, mealTypes]) => {
              const totalCalories = Math.round(Object.values(mealTypes).flat().reduce((acc, meal) => acc + (meal.nutrients.NUTR_CONT1 * meal.quantity), 0));
              const totalCarbos = Math.round(Object.values(mealTypes).flat().reduce((acc, meal) => acc + (meal.nutrients.NUTR_CONT2 * meal.quantity), 0));
              const totalProteins = Math.round(Object.values(mealTypes).flat().reduce((acc, meal) => acc + (meal.nutrients.NUTR_CONT3 * meal.quantity), 0));
              const totalFats = Math.round(Object.values(mealTypes).flat().reduce((acc, meal) => acc + (meal.nutrients.NUTR_CONT4 * meal.quantity), 0));

              return (
              <div className="job-card" key={date}>
                <div className="job-card-header">
                  <h3>{date}</h3>
                  {visibleMenu[date] ? (
                    <div className="menu-dot" onClick={() => closeMenuClick()}><div className="menu-dot-area"></div></div>
                  ) : (
                    <div className="menu-dot" onClick={() => toggleMenuVisibility(date)}><div className="menu-dot-area"></div></div>
                  ) }
                </div>
                <span className="total-calories">{totalCalories}kcal | {totalCarbos}g | {totalProteins}g | {totalFats}g</span>
                {Object.entries(mealTypes).map(([mealType, meals]) => (
                  <div className="job-card-box" key={mealType}> {/* 식사 유형을 기반으로 한 고유한 key 설정 */}
                    <div className="job-card-title">{mealType}</div>
                    <div className="job-detail-buttons">
                      {meals.map((meal, mealIndex) => (
                        <div className="search-content-list">
                          <button className="detail-button" key={`${mealType}-${mealIndex}`}>
                            <p>{meal.desc_kor} x {meal.quantity}</p>
                            {/* <p>{meal.nutrients.NUTR_CONT1}/{meal.nutrients.NUTR_CONT2}/{meal.nutrients.NUTR_CONT3}/{meal.nutrients.NUTR_CONT4}</p> */}
                          </button>
                          {visibleMenu2[meal.id] && (
                            <EditMealPlanModal
                            mealPlan={currentMealPlan}
                            onSave={(id, quantity) => handleSaveMealPlan(id, quantity, token)}/>
                            )}
                          {visibleMenu[date] && (
                              <div className="diet-edit-flex">
                                {visibleMenu2[meal.id] ? (
                                  <button className="detail-button" onClick={() => closeEditClick()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-square" viewBox="0 0 16 16">
                                      <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                      <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                    </svg>
                                  </button>
                                ) : (
                                  <button className="detail-button" onClick={() => handleEditClick(meal, meal.id)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                                      <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                                      <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"/>
                                    </svg>
                                  </button>
                                )}
                                <button className="detail-button" onClick={() => handleDeleteMealPlan(meal.id)}>
                                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                    <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                                  </svg>
                                </button>
                              </div>
                            )}
                        </div>
                      )
                      )}
                      {visibleMenu[date] && (
                      <div className="search-content-list full-width">
                        <AddFoodButton date={date} mealType={mealType} />
                      </div>
                      )}

                    </div>
                  </div>
                ))}
                {/* <div className="job-card-buttons">
                  <button className="search-buttons card-buttons">Edit</button>
                  <button className="search-buttons card-buttons-msg">Delete</button>
                </div> */}
              </div>)
            })}

            </div>
          
          
        </div>
      </div>
      <a href="/meal-type-select">
          <div className="add-diet-button">
            <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2"/>
            </svg>
          </div>
        </a>
    </div>
    );
  }
  
  