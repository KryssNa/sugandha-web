// // services/auth.service.ts
// import { api } from '@/lib/axios';

// interface LoginData {
//   email: string;
//   password: string;
// }

// interface RegisterData extends LoginData {
//   firstName: string;
//   lastName: string;
// }

// interface AuthResponse {
//   success: boolean;
//   data?: any;
//   message?: string;
// }

// export const authService = {
//   async register(data: RegisterData): Promise<AuthResponse> {
//     try {
//       const response = await api.post('/auth/register', data);
//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Registration failed'
//       };
//     }
//   },

//   async login(data: LoginData): Promise<AuthResponse> {
//     try {
//       const response = await api.post('/auth/login', data);
//       const { tokens, user } = response.data.data;

//       if (tokens?.accessToken) {
//         localStorage.setItem('accessToken', tokens.accessToken);
//         localStorage.setItem('refreshToken', tokens.refreshToken);
//         localStorage.setItem('user', JSON.stringify(user));

//         // Set default auth header
//         api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
//       }

//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Login failed'
//       };
//     }
//   },

//   async verifyAccessToken(token: string): Promise<boolean> {
//     try {
//       const response = await api.post('/auth/verify-token', { token });
//       return response.data.success;
//     } catch (error) {
//       return false;
//     }
//   },

//   async refreshToken(): Promise<AuthResponse> {
//     try {
//       const refreshToken = localStorage.getItem('refreshToken');
//       if (!refreshToken) throw new Error('No refresh token found');

//       const response = await api.post('/auth/refresh-token', { refreshToken });
//       const { accessToken } = response.data;

//       localStorage.setItem('accessToken', accessToken);
//       api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Token refresh failed'
//       };
//     }
//   },

//   async logout() {
//     try {
//       await api.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout error:', error);
//     } finally {
//       localStorage.removeItem('accessToken');
//       localStorage.removeItem('refreshToken');
//       localStorage.removeItem('user');
//       delete api.defaults.headers.common['Authorization'];
//     }
//   },

//   async getMe(): Promise<AuthResponse> {
//     try {
//       const response = await api.get('/auth/me');
//       return {
//         success: true,
//         data: response.data
//       };
//     } catch (error: any) {
//       return {
//         success: false,
//         message: error.response?.data?.message || 'Failed to fetch user data'
//       };
//     }
//   },

//   getStoredToken() {
//     if (typeof window !== 'undefined') {
//       return localStorage.getItem('accessToken');
//     }
//     return null;
//   },

//   getStoredUser() {
//     if (typeof window !== 'undefined') {
//       const user = localStorage.getItem('user');
//       return user ? JSON.parse(user) : null;
//     }
//     return null;
//   }
// };


// services/auth.service.ts
import { api } from '@/lib/axios';
import Cookies from 'js-cookie';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData extends LoginData {
  firstName: string;
  lastName: string;
}

interface AuthResponse {
  success: boolean;
  data?: any;
  message?: string;
}
interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/register', data);
      const { tokens, user } = response.data.data;

      if (tokens?.accessToken) {
        // Set in both cookies and localStorage
        Cookies.set('accessToken', tokens.accessToken, {
          expires: 7, // 7 days
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });

        Cookies.set('refreshToken', tokens.refreshToken, {
          expires: 30, // 30 days
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });

        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed'
      };
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post('/auth/login', data);
      const { tokens, user } = response.data.data;

      if (tokens?.accessToken) {
        // Set in both cookies and localStorage
        Cookies.set('accessToken', tokens.accessToken, {
          expires: 7, // 7 days
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });

        Cookies.set('refreshToken', tokens.refreshToken, {
          expires: 30, // 30 days
          sameSite: 'strict',
          secure: process.env.NODE_ENV === 'production'
        });

        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
        localStorage.setItem('user', JSON.stringify(user));

        // Set default auth header
        api.defaults.headers.common['Authorization'] = `Bearer ${tokens.accessToken}`;
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
      };
    }
  },

  async verifyAccessToken(): Promise<boolean> {
    try {
      const token = Cookies.get('accessToken') || localStorage.getItem('accessToken');
      if (!token) return false;

      const response = await api.post('/auth/verify-token', { token });
      return response.data.success;
    } catch (error) {
      return false;
    }
  },
  async getProfile(): Promise<AuthResponse> {
    try {
      const response = await api.get('/users/profile');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch profile'
      };
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<AuthResponse> {
    try {
      const response = await api.patch('/users/profile', data);
      
      // If update is successful, update the stored user data
      if (response.data.success) {
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to update profile'
      };
    }
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear both cookies and localStorage
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.clear();
      delete api.defaults.headers.common['Authorization'];
    }
  },

  async getMe(): Promise<AuthResponse> {
    try {
      const response = await api.get('/auth/getMe');
      return {
        success: true,
        data: response.data
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to fetch user data'
      };
    }
  },

  getToken(): string | null {
    return Cookies.get('accessToken') || localStorage.getItem('accessToken');
  },

  getStoredUser() {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }
};