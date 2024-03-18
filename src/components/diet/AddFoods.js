import React, { useState, useEffect, useContext } from 'react';
import { addToDiet } from '../../services/DietService';
import { AccountContext } from '../../Context/Account';
import { BASIC_URL } from '../../services/DietService';

function NutritionList() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  const formattedDate = `${year}-${month}-${day}`;

  const [searchTerm, setSearchTerm] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [numOfRows, setNumOfRows] = useState(10);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [date, setDate] = useState('');
  const [pastDate, setPastDate] = useState(false);
  const [mealType, setMealType] = useState('');
  const [username, setUsername] = useState('');
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState('');

  const [tempSearchTerm, setTempSearchTerm] = useState('');


  const { getSession } = useContext(AccountContext);


  useEffect(() => {
    getSession().then((session) => {
        const queryParams = new URLSearchParams(window.location.search);
        const getDate = queryParams.get('date');
        const getMealType = queryParams.get('mealType');
        setMealType(getMealType);
        if(getDate){
            setDate(getDate);    
        } 
        else if(pastDate){
        }
        else{
            setDate(formattedDate);
        }
        
        setUsername(session.user.username);
        setToken(session.idToken.jwtToken);

        const fetchNutritionInfo = async () => {
            if (!searchTerm) return; // 검색어가 없으면 요청을 보내지 않음
            setLoading(true);
            const url = `${BASIC_URL}/get-nutrition-info/?search_term=${searchTerm}&page_no=${pageNo}&num_of_rows=${numOfRows}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data.body);
                setResults(data.body.items || []); // 'results' 필드 내의 배열을 설정하거나, 해당 필드가 없을 경우 빈 배열을 설정
                setTotalPages(Math.ceil(data.body.totalCount / data.body.numOfRows)); // 전체 페이지 수 설정
            } catch (error) {
                console.error('Error fetching nutrition info:', error);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };
    
        fetchNutritionInfo();
    });
  }, [searchTerm, pageNo, numOfRows]); // 검색어, 페이지 번호, 행 수가 변경될 때마다 요청

  
  // 입력 필드 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "tempSearchTerm") {
        setTempSearchTerm(e.target.value);
    } else if (name === "date") {
        setDate(value);
        setPastDate(true);
    }
  };

  // 검색 버튼 클릭 핸들러
  const handleSearchClick = () => {
    setSearchTerm(tempSearchTerm); // 사용자가 입력한 임시 검색어를 실제 검색어 상태로 설정
    setPageNo(1); // 검색 버튼을 클릭할 때마다 페이지 번호를 1로 리셋
  };

  // 페이지 이동 함수
  const goToPrevPage = () => setPageNo(Math.max(1, pageNo - 1));
  const goToNextPage = () => setPageNo(Math.min(totalPages, pageNo + 1));

  return (
    <div className="foods-container">
        <div className="profile-box">
            <div className='list-input'>
                <h2>식단 추가</h2>
                {/* <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}>
                    <option value="">식사 유형 선택</option>
                    <option value="breakfast">아침</option>
                    <option value="lunch">점심</option>
                    <option value="dinner">저녁</option>
                    <option value="snack">간식</option>
                </select> */}

                <input type="date" name="date" value={date} onChange={handleInputChange} />
                <input
                    type="text"
                    placeholder="Search term"
                    name="tempSearchTerm"
                    value={tempSearchTerm} // 임시 검색어 상태와 연결
                    onChange={handleInputChange} // 입력 필드 변경 시 handleInputChange 호출
                />
                <button className="search-food-button" onClick={handleSearchClick}>Search</button> {/* 검색 버튼 추가 */}

                
                <div>
                    페이지당 결과 수: 
                    <select value={numOfRows} onChange={(e) => setNumOfRows(parseInt(e.target.value, 10))}>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    </select>
                </div>
                {loading ? (
                    <div className='no-content-list'><div className="loading">Loading&#8230;</div></div>
                ) : results.length === 0 ? (
                    <div className='flex-center'>
                        <div className='no-content-list'>결과 없음</div>
                        <div>
                            <button className='list-buttons' onClick={goToPrevPage}>Prev</button>
                            <span> Page 0 of 0 </span>
                            <button className='list-buttons' onClick={goToNextPage}>Next</button>
                        </div>
                    </div>
                ) : (
                    <div className='flex-center'>
                        <div className="list">
                        <ul>
                            <li>이름</li>
                            <li>탄수화물 (g)</li>
                            <li>단백질 (g)</li>
                            <li>지방 (g)</li>
                            <li>열량 (kcal)</li>
                            <li>1회 제공량 (g)</li>
                            <li>수량</li>
                            <li>추가</li>
                        </ul>
                        {results.map((item, index) => (
                            <ul key={index}>
                                <li><p className='food-header'>이름</p><p>{item.DESC_KOR.length > 12 ? `${item.DESC_KOR.substring(0, 12)}...` : item.DESC_KOR}</p></li>
                                <li><p className='food-header'>탄수화물 (g)</p>{item.NUTR_CONT2}</li>
                                <li><p className='food-header'>단백질 (g)</p>{item.NUTR_CONT3}</li>
                                <li><p className='food-header'>지방 (g)</p>{item.NUTR_CONT4}</li>
                                <li><p className='food-header'>열량 (kcal)</p>{item.NUTR_CONT1}</li>
                                <li><p className='food-header'>1회 제공량 (g)</p>{item.SERVING_WT}</li>
                                <li>
                                    <p className='food-header'>수량</p>
                                    <input
                                        type="number"
                                        value={quantities[item.DESC_KOR] || 1}
                                        onChange={(e) => setQuantities({...quantities, [item.DESC_KOR]: parseInt(e.target.value, 10)})}
                                        min="1"
                                    />
                                </li>
                                <li>
                                <button className="add-buttons" onClick={() => addToDiet(item, mealType, date, quantities[item.DESC_KOR] || 1, username, token)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-square" viewBox="0 0 16 16">
                                        <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
                                    </svg>
                                </button>
                                </li>
                            </ul>
                        ))}
                            
                        </div>
                        <div>
                            <button className='list-buttons' onClick={goToPrevPage}>Prev</button>
                            <span> Page {pageNo} of {totalPages} </span>
                            <button className='list-buttons' onClick={goToNextPage}>Next</button>
                        </div>
                    </div>
                )}

                
            </div>
      </div>
    </div>
  );
}

export default NutritionList;
