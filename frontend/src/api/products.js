import { request } from './apiClient';

export async function fetchProducts({ page = 1, perPage = 50, query, category, sellerId } = {}) {
  const params = new URLSearchParams();
  params.append('page', String(page));
  params.append('perPage', String(perPage));
  if (query) params.append('query', query);
  if (category) params.append('category', category);
  if (sellerId) params.append('sellerId', sellerId);

  const response = await request(`/api/products?${params.toString()}`);
  return response.data || [];
}

export async function fetchProductById(id) {
  const response = await request(`/api/products/${id}`);
  return response.data;
}

export async function createProduct(data) {
  const response = await request('/api/products', {
    method: 'POST',
    body: data,
  });
  return response.data;
}

export async function updateProduct(id, data) {
  const response = await request(`/api/products/${id}`, {
    method: 'PATCH',
    body: data,
  });
  return response.data;
}

export async function deleteProduct(id) {
  await request(`/api/products/${id}`, {
    method: 'DELETE',
  });
  return { success: true };
}
