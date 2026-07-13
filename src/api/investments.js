import { mockResponse } from './client';
import { mockInvestments } from '@/utils/mockData';

export const getInvestments = async () => mockResponse(mockInvestments, 350);

export const getInvestment = async (id) => {
  const item = mockInvestments.find((x) => x.id === id);
  if (!item) throw { status: 404, message: 'Investment not found.' };
  return mockResponse(item, 250);
};

export const createInvestment = async (payload) => {
  return mockResponse({ id: `inv_${Date.now()}`, ...payload }, 500);
};

export const investInPlan = async (id, { amount }) => {
  if (!amount || amount <= 0) {
    throw { status: 400, message: 'Please enter a valid amount.' };
  }
  return mockResponse(
    { success: true, planId: id, amount, reference: `INV-${Date.now()}` },
    600,
  );
};
