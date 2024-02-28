import apiClient from '../ApiClient'; // ApiClient 모듈 임포트

export const fetchUserHealthProfile = async (username, token) => {
  try {
    const response = await apiClient.get(`/api/v1/user/${username}/health_profiles/`, {
      headers: { 'Authorization': `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserHealthProfile = async (username, profileData, profileExists, token) => {
  try {
    const method = profileExists ? 'put' : 'post';
    const response = await apiClient[method](
      `/api/v1/user/${username}/health_profiles/`, 
      profileData, 
      {
        headers: { 'Authorization': `Bearer ${token}` }, // 토큰을 Authorization 헤더에 추가
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
