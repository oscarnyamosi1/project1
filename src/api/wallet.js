import { mockResponse } from './client';
import { mockBalances, mockWalletHistory } from '@/utils/mockData';

export const getWallet = async () =>
  mockResponse(
    {
      balance: mockBalances.walletBalance,
      currency: 'USD',
      history: mockWalletHistory,
    },
    300,
  );

export const depositFunds = async ({ amount, method }) => {
  if (!amount || amount <= 0) throw { status: 400, message: 'Enter a valid amount.' };
  return mockResponse(
    { success: true, amount, method, reference: `DEP-${Date.now()}` },
    600,
  );
};

export const withdrawFunds = async ({ amount, account }) => {
  if (!amount || amount <= 0) throw { status: 400, message: 'Enter a valid amount.' };
  return mockResponse(
    { success: true, amount, account, reference: `WD-${Date.now()}` },
    700,
  );
};

export const transferFunds = async ({ amount, recipient }) => {
  if (!amount || amount <= 0) throw { status: 400, message: 'Enter a valid amount.' };
  if (!recipient) throw { status: 400, message: 'Recipient is required.' };
  return mockResponse(
    { success: true, amount, recipient, reference: `TR-${Date.now()}` },
    600,
  );
};
