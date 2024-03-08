export const BASIC_URL = '/api/v1/diet'

// 선택된 항목을 식단에 추가하는 함수
export const addToDiet = async (item, mealType, date, quantity, username, token) => {
    if (!mealType) {
      alert('식사 유형을 선택해주세요.');
      return;
    }
    const response = await fetch(`${BASIC_URL}/diets/${username}/meal-plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        meal_type: mealType,
        username: username,
        desc_kor: item.DESC_KOR,
        quantity: quantity,
        current_date: date,
        nutrients: {
          NUTR_CONT1: item.NUTR_CONT1,
          NUTR_CONT2: item.NUTR_CONT2,
          NUTR_CONT3: item.NUTR_CONT3,
          NUTR_CONT4: item.NUTR_CONT4,
          SERVING_WT: item.SERVING_WT
        },
      }),
    });
    if (response.ok) {
      alert('식단에 추가되었습니다!');
    } else {
        console.log('Response Status:', response.status); // 응답 상태 코드를 콘솔에 출력
        console.log('Response Body:', await response.json()); 
      alert('식단 추가에 실패했습니다.');
    }
  };

  export const handleSaveMealPlan = async (id, quantity, token) => {
  
    // API 엔드포인트 URL 구성
    const url = `${BASIC_URL}/meal-plans/${id}`;
  
    try {
      // PUT 요청으로 백엔드에 수량 업데이트 요청
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // 인증 헤더에 JWT 토큰 추가
        },
        body: JSON.stringify({ quantity: quantity }), // 요청 본문에 수량 데이터 포함
      });
  
      if (!response.ok) {
        // 요청이 실패한 경우 (응답 상태 코드가 200-299가 아닌 경우)
        throw new Error('Failed to update meal plan');
      }
  
      const updatedMealPlan = await response.json();
      console.log('Updated meal plan:', updatedMealPlan);
  
      // 요청이 성공한 후의 처리, 예를 들어 상태 업데이트 또는 사용자에게 성공 알림 표시 등
      // 예: setGroupedDiets(...) 또는 다른 상태 업데이트 로직
    } catch (error) {
      console.error('Error updating meal plan:', error);
      // 에러 처리 로직, 예를 들어 사용자에게 에러 메시지 표시
    }
  };
