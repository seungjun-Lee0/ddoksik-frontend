import React, { useState, useEffect, useContext } from 'react';
import { Line } from 'react-chartjs-2';
import { fetchWeeklyCalories } from '../../services/DietService';
import { fetchUserDailyCalories } from '../../services/HealthProfileService';
import { AccountContext } from '../../Context/Account';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

// const labels = ['월', '화', '수', '목', '금', '토', '일'];
function generateLabels() {
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const today = new Date();
  const labels = [];
  for (let i = 6; i >= 0; i--) {
    labels.push(days[(today.getDay() - i + 7) % 7]);
  }
  return labels;
}

function CalorieChart() {
  const [darkMode, setDarkMode] = useState(false);
  const [targetKcal, setTargetKcal] = useState(0);
  const [weeklyData, setWeeklyData] = useState({ recent_week_calories: {}, previous_week_calories: {} });
  const [insufficientData, setInsufficientData] = useState(false);

  const { getSession } = useContext(AccountContext);

  const labels = generateLabels();

  useEffect(() => {
    const mode = localStorage.getItem("darkMode") === "true";
    setDarkMode(mode);

    getSession().then(async (session) => {
      try {
        const weeklyCalories = await fetchWeeklyCalories(session.user.username, session.idToken.jwtToken);
        // 데이터 처리 로직 추가
        const formatDataForChart = (weeklyCalories) => {
          // 요일별로 정렬된 데이터를 생성하기 위한 로직
          const sortedThisWeek = labels.map(day => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - labels.indexOf(day)));
            const formattedDate = date.toISOString().split('T')[0];
            return weeklyCalories.recent_week_calories[formattedDate] || 0;
          });
          const sortedLastWeek = labels.map(day => {
            const date = new Date();
            date.setDate(date.getDate() - (13 - labels.indexOf(day)));
            const formattedDate = date.toISOString().split('T')[0];
            return weeklyCalories.previous_week_calories[formattedDate] || 0;
          });
          return { thisWeek: sortedThisWeek, lastWeek: sortedLastWeek };
        };
        const formattedWeeklyData = formatDataForChart(weeklyCalories);
        checkForInsufficientData(formattedWeeklyData);
        setWeeklyData(formattedWeeklyData);
      } catch (error) {
        console.error('Failed to fetch weekly calories');
        alert('Failed to fetch weekly calories');
      }

      try{
        const targetNutritionTotals = await fetchUserDailyCalories(session.user.username, session.idToken.jwtToken);   
        setTargetKcal(targetNutritionTotals.daily_calories);
      }catch(error){
        console.error('Failed to fetch daily calories:', error);
        alert('Failed to fetch daily calories.');
      }
    });
  }, []);

  const data = {
    labels,
    datasets: [
      {
        label: '이번 주',
        data: weeklyData.thisWeek,
        borderColor: darkMode ? 'rgba(100, 100, 100, 0.6)' : 'rgba(85, 85, 255, 0.6)',
        backgroundColor: darkMode ? 'rgba(100, 100, 100, 0.9)' : 'rgba(85, 85, 255, 0.6)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: '지난 주',
        data: weeklyData.lastWeek,
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 85, 184, 0.6)',
        backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 85, 184, 0.6)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
      },
      {
        label: '목표 kcal',
        data: [targetKcal,targetKcal,targetKcal,targetKcal,targetKcal,targetKcal,targetKcal],
        borderColor: 'rgba(255, 159, 64, 0.6)',
        borderWidth: 2,
        borderDash: [10, 5], // 점선으로 표시
        pointRadius: 0, // 데이터 포인트 표시 안 함
      },
    ],
  };

  const data2 = {
    labels,
    datasets: [
      {
        label: '아직 충분한 데이터가 수집되지 않았습니다.',
        data: [targetKcal,targetKcal,targetKcal,targetKcal,targetKcal,targetKcal,targetKcal],
        borderColor: 'rgba(255, 159, 64, 0.6)',
        borderWidth: 2,
        borderDash: [10, 5], // 점선으로 표시
        pointRadius: 0, // 데이터 포인트 표시 안 함
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          drawBorder: false,
          display: false,
        }
      },
      y: {
        grid: {
          drawBorder: false,
          display: true,
          drawOnChartArea: false,
        }
      }
    },
  };

  function checkForInsufficientData(data) {
    const thisWeekZeros = data.thisWeek.filter(x => x === 0).length;
    const lastWeekZeros = data.lastWeek.filter(x => x === 0).length;

    if (thisWeekZeros > 3 || lastWeekZeros > 3) {
      setInsufficientData(true);
    } else {
      setInsufficientData(false);
    }
  }

  const renderChartContent = () => {
    if (insufficientData) {
      return <Line className='canvas' options={options} data={data2} />
      
    } else {
      return <Line className='canvas' options={options} data={data} />;
    }
  };

  return(
    <div>
       {renderChartContent()}
    </div>
  );
}

export default CalorieChart;
