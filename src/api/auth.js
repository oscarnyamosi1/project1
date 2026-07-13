import { mockResponse } from './client';
import { mockUser } from '@/utils/mockData';

const TOKEN = 'wp_token';
const USER = 'wp_user';

const generateToken = () =>
  `wp.${Math.random().toString(36).slice(2)}.${Date.now()}`;

export const registerUser = async (data) => {
  if (!data?.email || !data?.password) {
    throw { status: 400, message: 'Email and password are required.' };
  }
  const user = {
    ...mockUser,
    fullName: data.fullName || 'New Member',
    email: data.email,
    kycStatus: 'pending',
  };
  const token = generateToken();
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(USER, JSON.stringify(user));
  return mockResponse({ user, token }, 700);
};

export const loginUser = async (data) => {
  if (!data?.email || !data?.password) {
    throw { status: 400, message: 'Please enter your email and password.' };
  }
  if (data.password.length < 4) {
    throw { status: 401, message: 'Invalid credentials. Try a longer password.' };
  }
  const user = { ...mockUser, email: data.email };
  const token = generateToken();
  localStorage.setItem(TOKEN, token);
  localStorage.setItem(USER, JSON.stringify(user));
  return mockResponse({ user, token }, 600);
};

export const logoutUser = async () => {
  localStorage.removeItem(TOKEN);
  localStorage.removeItem(USER);
  return mockResponse({ success: true }, 200);
};

export const refreshToken = async () => {
  const token = generateToken();
  localStorage.setItem(TOKEN, token);
  return mockResponse({ token }, 200);
};

export const requestPasswordReset = async (email) => {
  if (!email) throw { status: 400, message: 'Please enter your email.' };
  return mockResponse({ success: true, email }, 700);
};

export const resetPassword = async ({ password, confirm }) => {
  if (!password || password !== confirm) {
    throw { status: 400, message: 'Passwords do not match.' };
  }
  return mockResponse({ success: true }, 600);
};

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem(USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const getStoredToken = () => localStorage.getItem(TOKEN);
