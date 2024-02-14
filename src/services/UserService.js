import apiClient from '../ApiClient'; // ApiClient 모듈 임포트

export const checkTokenValidity = async (token) => {
  try {
    const response = await apiClient.get('/token/auth', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data; // 유효한 토큰이면, 사용자 정보나 성공 메시지를 반환
  } catch (error) {
    throw error; // 유효하지 않은 토큰이면, 에러 처리
  }
};

export const login = async (username, password) => {
  const formData = new URLSearchParams();
  formData.append('username', username);
  formData.append('password', password);

  const response = await apiClient.post('/token', formData, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  return response.data;
};

export const fetchUserDetails = async (username, token) => {
  const response = await apiClient.get(`/users/${username}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const registerUser = async (userData) => {
    try {
      const response = await apiClient.post('/users/', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  };