import apiClient from '../ApiClient'; // apiClient import 경로를 확인해주세요.

// Function to verify JWT token with the backend using axios
export const verifyTokenWithBackend = async (token) => {
  try {
    const response = await apiClient.get('/protected-route', {
      headers: {
        'Authorization': `Bearer ${token}`, // 토큰을 Authorization 헤더에 포함하여 전송
      },
    });
    // 응답 데이터 반환
    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error.response ? error.response.data : error);
    throw error;
  }
};
