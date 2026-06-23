import api from './apiClient';

export const changePassword = async (data) => {
  const response = await api.post(
    '/account/change-password',
    data
  );

  return response.data;
};