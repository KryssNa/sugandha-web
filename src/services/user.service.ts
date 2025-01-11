
import { api } from '../lib/axios';



export const userService = {
  async getProfile() {
    return api.get('/users/profile');
  },

  async updateProfile(data: Partial<{ firstName: string; lastName: string; email: string }>) {
    return api.patch('/users/profile', data);
  },

  async getAllUsers(page = 1, limit = 10) {
    return api.get(`/users?page=${page}&limit=${limit}`);
  },

  async getUserById(id: string) {
    return api.get(`/users/${id}`);
  },

  async updateUser(id: string, data: Partial<{ firstName: string; lastName: string; email: string }>) {
    return api.patch(`/users/${id}`, data);
  },
  
  async deleteUser(id: string) {
    return api.delete(`/users/${id}`);
  },
  async setupTwoFA(method: string) {
    const response = await api.post('/users/2fa/setup', { method });
    return response.data;
  },

  async enableTwoFA(token: string) {
    const response = await api.post('/users/2fa/enable', { token });
    return response.data;
  },

  async disableTwoFA(token: string) {
    const response = await api.post('/users/2fa/disable', { token });
    return response.data;
  },

  // Email Verification
  async sendVerificationEmail() {
    const response = await api.post('/users/send-verification-email');
    return response.data;
  },

  async verifyEmail(token: string) {
    const response = await api.post('/users/verify-email', { token });
    return response.data;
  },

  // Active Devices
  async getActiveDevices() {
    const response = await api.get('/users/active-devices');
    return response.data.data;
  },

  // Password Management
  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.patch('/users/change-password', { 
      currentPassword, 
      newPassword 
    });
    return response.data;
  }
};

