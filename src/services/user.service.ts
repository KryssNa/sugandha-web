
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

  async deleteUser(id: string) {
    return api.delete(`/users/${id}`);
  }
};
