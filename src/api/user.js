import { mockResponse } from './client';
import { getStoredUser } from './auth';
import { mockUser } from '@/utils/mockData';

export const getProfile = async () => {
  const user = getStoredUser() || mockUser;
  return mockResponse(user, 250);
};

export const updateProfile = async (patch) => {
  const current = getStoredUser() || mockUser;
  const next = { ...current, ...patch };
  localStorage.setItem('wp_user', JSON.stringify(next));
  return mockResponse(next, 400);
};

export const updatePassword = async ({ currentPassword, newPassword, confirmPassword }) => {
  if (!currentPassword || !newPassword) {
    throw { status: 400, message: 'All fields are required.' };
  }
  if (newPassword !== confirmPassword) {
    throw { status: 400, message: 'New passwords do not match.' };
  }
  if (newPassword.length < 6) {
    throw { status: 400, message: 'New password must be at least 6 characters.' };
  }
  return mockResponse({ success: true }, 500);
};

export const updateSecuritySettings = async (settings) => {
  const current = getStoredUser() || mockUser;
  const next = { ...current, ...settings };
  localStorage.setItem('wp_user', JSON.stringify(next));
  return mockResponse(next, 300);
};
