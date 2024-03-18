import apiClient from '../ApiClient';

export const verifyTokenWithBackend = async (token) => {
  try {
    const response = await apiClient.get('/api/v1/user/protected-route', {
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
