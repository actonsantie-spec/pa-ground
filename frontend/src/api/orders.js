import { request } from './apiClient';

export async function fetchOrders({ page = 1, perPage = 50, status, buyerId, sellerId } = {}) {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('perPage', String(perPage));
  if (status) params.append('status', status);
  if (buyerId) params.append('buyerId', buyerId);
  if (sellerId) params.append('sellerId', sellerId);

  const response = await request(`/api/orders?${params.toString()}`);
  return response.data || [];
}

export async function fetchOrderById(id) {
  const response = await request(`/api/orders/${id}`);
  return response.data;
}

export async function createOrder(orderData) {
  const response = await request('/api/orders', {
    method: 'POST',
    body: orderData,
  });
  return response.data;
}

export async function updateOrderStatus(orderId, status) {
  const response = await request(`/api/orders/${orderId}/status`, {
    method: 'PATCH',
    body: { status },
  });
  return response.data;
}

export async function fetchOrderTracking(orderId, options = {}) {
  const response = await request(`/api/orders/${orderId}/track`, {
    method: 'GET',
    ...options,
  });
  return response;
}
