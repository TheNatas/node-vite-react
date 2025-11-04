import axios from 'axios';
import type { LoginDTO, RegisterDTO, AuthResponse, User } from '../types/auth';

const API_URL = '/api/auth';

const getToken = (): string | null => {
  return localStorage.getItem('token');
};

const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

const removeToken = (): void => {
  localStorage.removeItem('token');
};

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const authService = {
  async register(data: RegisterDTO): Promise<AuthResponse> {
    try {
      const response = await axios.post<{ success: boolean; data: AuthResponse }>(`${API_URL}/register`, data);
      const { user, token } = response.data.data;
      setToken(token);
      return { user, token };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao criar conta');
      }
      throw new Error('Erro ao criar conta');
    }
  },

  async login(data: LoginDTO): Promise<AuthResponse> {
    try {
      const response = await axios.post<{ success: boolean; data: AuthResponse }>(`${API_URL}/login`, data);
      const { user, token } = response.data.data;
      setToken(token);
      return { user, token };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao fazer login');
      }
      throw new Error('Erro ao fazer login');
    }
  },

  async getMe(): Promise<User> {
    try {
      const response = await axios.get<{ success: boolean; data: User }>(`${API_URL}/me`, {
        headers: getAuthHeaders(),
      });
      return response.data.data;
    } catch (error: unknown) {
      removeToken();
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data.message || 'Erro ao buscar usuário');
      }
      throw new Error('Erro ao buscar usuário');
    }
  },

  logout(): void {
    removeToken();
  },

  getToken,
  isAuthenticated(): boolean {
    return getToken() !== null;
  },
};
