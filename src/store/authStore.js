import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      teams: [],
      pendingInvitations: [],
      recentActivity: [],
      isAuthenticated: false,
      isLoading: false,

      setToken: (token) => {
        if (token) {
          localStorage.setItem('token', token);
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          set({ token, isAuthenticated: true });
        } else {
          localStorage.removeItem('token');
          document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
          set({ token: null, isAuthenticated: false, user: null });
        }
      },

      refreshToken: async () => {
        try {
          const currentToken = get().token;
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            get().logout();
            throw new Error('Failed to refresh token');
          }

          const data = await response.json();
          get().setToken(data.token);
          return data.token;
        } catch (error) {
          console.error('Token refresh failed:', error);
          get().logout();
          throw error;
        }
      },

      checkAuth: async () => {
        try {
          const token = get().token;
          if (!token) {
            set({ isAuthenticated: false });
            return false;
          }
          
          await get().fetchUserInfo();
          return true;
        } catch (error) {
          get().logout();
          return false;
        }
      },

      fetchUserInfo: async () => {
        try {
          const makeRequest = async (token) => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/info`, {
              headers: {
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.status === 401) {
              // Try to refresh token
              const newToken = await get().refreshToken();
              return makeRequest(newToken); // Retry with new token
            }

            if (!response.ok) throw new Error('Failed to fetch user info');

            return response.json();
          };

          const data = await makeRequest(get().token);
          set({ 
            user: data.user,
            teams: data.teams,
            pendingInvitations: data.pending_invitations,
            recentActivity: data.recent_activity,
            isAuthenticated: true
          });
          return data;
        } catch (error) {
          console.error('Error fetching user info:', error);
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
          }

          const data = await response.json();
          
          if (data.token) {
            get().setToken(data.token);
            await get().fetchUserInfo();
            set({ isLoading: false });
            return data;
          }
          
          throw new Error('No token received');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async ({ email, password, name }) => {
        set({ isLoading: true });
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, name }),
          });

          if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
          }

          const data = await response.json();
          
          if (data.token) {
            get().setToken(data.token);
            await get().fetchUserInfo();
            set({ isLoading: false });
            return data;
          }
          
          throw new Error('No token received');
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      authenticatedRequest: async (url, options = {}) => {
        try {
          const makeRequest = async (token) => {
            const response = await fetch(url, {
              ...options,
              headers: {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
              },
            });

            if (response.status === 401) {
              // Try to refresh token
              const newToken = await get().refreshToken();
              return makeRequest(newToken); // Retry with new token
            }

            if (!response.ok) {
              const error = await response.json().catch(() => ({ message: 'Request failed' }));
              throw new Error(error.message);
            }

            return response;
          };

          return await makeRequest(get().token);
        } catch (error) {
          console.error('Authenticated request failed:', error);
          throw error;
        }
      },

      logout: () => {
        localStorage.removeItem('token');
        document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        set({
          token: null,
          user: null,
          teams: [],
          pendingInvitations: [],
          recentActivity: [],
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;