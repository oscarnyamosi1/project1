import { mockResponse } from './client';
import { mockTransactions } from '@/utils/mockData';

export const getTransactions = async (filters = {}) => {
  let data = [...mockTransactions];

  if (filters.type && filters.type !== 'all') {
    data = data.filter((t) => t.type === filters.type);
  }
  if (filters.status && filters.status !== 'all') {
    data = data.filter((t) => t.status === filters.status);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    data = data.filter(
      (t) =>
        t.method.toLowerCase().includes(q) ||
        t.reference.toLowerCase().includes(q),
    );
  }

  return mockResponse(data, 280);
};
