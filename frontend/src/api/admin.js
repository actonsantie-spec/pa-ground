import { request } from './apiClient';

export async function fetchAdminStats(range = '30days') {
  return request(`/api/admin/stats?range=${encodeURIComponent(range)}`);
}

export async function fetchAdminUsers({ page = 1, perPage = 20, query } = {}) {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('perPage', String(perPage));
  if (query) params.append('query', query);
  return request(`/api/admin/users?${params.toString()}`);
}

export async function updateAdminUser(userId, data) {
  return request(`/api/admin/users/${userId}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function fetchAdminSellers({ page = 1, perPage = 20, query } = {}) {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('perPage', String(perPage));
  if (query) params.append('query', query);
  return request(`/api/admin/sellers?${params.toString()}`);
}

export async function updateAdminSeller(sellerId, data) {
  return request(`/api/admin/sellers/${sellerId}`, {
    method: 'PATCH',
    body: data,
  });
}

export async function fetchAdminOrders({ page = 1, perPage = 20, status, buyerId, sellerId } = {}) {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('perPage', String(perPage));
  if (status) params.append('status', status);
  if (buyerId) params.append('buyerId', buyerId);
  if (sellerId) params.append('sellerId', sellerId);
  return request(`/api/admin/orders?${params.toString()}`);
}

export async function fetchAdminReports() {
  return request('/api/admin/reports');
}
