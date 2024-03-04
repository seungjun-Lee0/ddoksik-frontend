import React, { useState, useEffect } from 'react';

function EditMealPlanModal({ mealPlan, onSave }) {
  // Initialize quantity with a default value or the mealPlan's quantity if it's available
  const [quantity, setQuantity] = useState(mealPlan?.quantity || 0);

  // Update quantity if mealPlan changes and is not null
  useEffect(() => {
    if (mealPlan) {
      setQuantity(mealPlan.quantity);
    }
  }, [mealPlan]);

  const handleSave = () => {
    onSave(mealPlan.id, quantity); // Ensure you're passing the updated quantity, not mealPlan.quantity
    // 모달 닫기 로직 (상태 변경 등을 통해)
  };

  return (
      <div className="diet-modal-content">
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button className="diet-edit-button" onClick={handleSave}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check2-square" viewBox="0 0 16 16">
          <path d="M3 14.5A1.5 1.5 0 0 1 1.5 13V3A1.5 1.5 0 0 1 3 1.5h8a.5.5 0 0 1 0 1H3a.5.5 0 0 0-.5.5v10a.5.5 0 0 0 .5.5h10a.5.5 0 0 0 .5-.5V8a.5.5 0 0 1 1 0v5a1.5 1.5 0 0 1-1.5 1.5z"/>
          <path d="m8.354 10.354 7-7a.5.5 0 0 0-.708-.708L8 9.293 5.354 6.646a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0"/>
        </svg>
        </button>
      </div>
  );
}

export default EditMealPlanModal;
