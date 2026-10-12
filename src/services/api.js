// A relative URL lets a device on the same network use the host that served the
// web app. Vite forwards /api to the local API during development. Set
// VITE_API_URL only when the API is deployed on a separate public URL.
const API_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
const TOKEN_KEY = 'kisansetu_access_token';
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function setToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }
export async function api(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {}), ...options.headers } });
  } catch {
    throw new Error('Unable to reach KisanSetu. Check that the API server is running and that this device is on the same network.');
  }
  const data = response.status === 204 ? null : await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Request failed'); return data;
}
export const authApi = { login: (identifier, password) => api('/auth/login', { method: 'POST', body: JSON.stringify({ identifier, password }) }), register: (payload) => api('/auth/register', { method: 'POST', body: JSON.stringify(payload) }) };
export const bookingApi = { list: () => api('/bookings'), create: (payload) => api('/bookings', { method: 'POST', body: JSON.stringify(payload) }), status: (id, payload) => api(`/bookings/${id}/status`, { method: 'PATCH', body: JSON.stringify(payload) }), procurement: (id, payload) => api(`/bookings/${id}/procurement`, { method: 'POST', body: JSON.stringify(payload) }) };
export const notificationApi = { list: () => api('/notifications'), read: (id) => api(`/notifications/${id}/read`, { method: 'PATCH' }) };
export function bookingForUi(item) { return { ...item, id: item._id, farmerName: item.farmer?.name, phone: item.farmer?.phone, mandiName: item.mandi?.name, mandiId: item.mandi?._id, crop: item.crop?.name || item.crop, scheduledDate: item.scheduledDate?.slice(0, 10), estimatedWaitMins: item.estimatedWaitMins ?? 30 }; }
