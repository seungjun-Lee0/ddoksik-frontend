import React from 'react';
import { useNavigate } from 'react-router-dom';

function MealTypeSelect() {
  // Use the useHistory hook to get access to the history object
  const navigate = useNavigate();

  // Handler for button click that redirects to the specific URL
  const handleSelectMealType = (mealType) => {
    navigate(`/search-foods?mealType=${mealType}`);
  };

  return (
    <div className="profile-container">
        <div className="profile-box">
            <div className="list-input">
                <h2>Select a Meal Type</h2>
                <div className="meal-type-buttons">
                    <button onClick={() => handleSelectMealType('breakfast')}>Breakfast</button>
                    <button onClick={() => handleSelectMealType('lunch')}>Lunch</button>
                    <button onClick={() => handleSelectMealType('dinner')}>Dinner</button>
                    <button onClick={() => handleSelectMealType('snack')}>Snack</button>
                </div>
            </div>
      </div>
    </div>
  );
}

export default MealTypeSelect;
