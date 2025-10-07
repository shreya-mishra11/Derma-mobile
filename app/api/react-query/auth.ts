import { useMutation } from '@tanstack/react-query';

const API_BASE_URL = 'https://98d9828fc5e9.ngrok-free.app/api';

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type AuthResponse = {
  success: boolean;
  token: string; // JWT
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
};

export const useRegister = () => {
  return useMutation<AuthResponse, Error, RegisterRequest>({
    mutationFn: async (body) => {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Register failed: ${res.status} ${res.statusText} - ${txt}`);
      }
      return res.json();
    },
  });
};

export const useLogin = () => {
  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (body) => {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Login failed: ${res.status} ${res.statusText} - ${txt}`);
      }
      return res.json();
    },
  });
};


