const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  adminUpdatePassword: async (userId, newPassword) => {
    const token = localStorage.getItem('hrms-token');
    const response = await fetch(`${API_BASE_URL}/auth/admin/update-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ userId, newPassword }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to update password');
    }
    
    return data;
  },

  adminGetUserPassword: async (userId) => {
    const token = localStorage.getItem('hrms-token');
    const response = await fetch(`${API_BASE_URL}/auth/admin/user-password/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to get password');
    }
    
    return data;
  },
};

export default api;