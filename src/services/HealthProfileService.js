import apiClient from '../ApiClient'; // ApiClient 모듈 임포트

export const fetchUserHealthProfile = async (userId, token) => {
  try {
    const response = await apiClient.get(`/users/${userId}/health_profiles/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserHealthProfile = async (userId, token, profileData, profileExists) => {
  try {
    const method = profileExists ? 'put' : 'post';
    const response = await apiClient[method](`/users/${userId}/health_profiles/`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
