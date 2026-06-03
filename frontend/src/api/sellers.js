import { request } from './apiClient';

export async function fetchSellers({ query, page = 1, perPage = 50 } = {}) {
  const params = new URLSearchParams();
  if (query) params.append('query', query);
  params.append('page', String(page));
  params.append('perPage', String(perPage));

  const response = await request(`/api/sellers?${params.toString()}`);
  return response.data || [];
}
