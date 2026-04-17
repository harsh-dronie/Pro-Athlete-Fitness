const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

function getToken() {
  return localStorage.getItem('admin_token');
}

async function authFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  if (res.status === 401) {
    localStorage.removeItem('admin_token');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  return res.json();
}

// Auth
export async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

// Dashboard
export const getDashboard = () => authFetch('/admin/dashboard');

// Leads
export const getLeads = (status?: string) =>
  authFetch(`/admin/leads${status ? `?status=${status}` : ''}`);

export const updateLeadStatus = (id: string, status: string) =>
  authFetch(`/admin/leads/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });

// Clients
export const getClients = (status?: string) =>
  authFetch(`/admin/clients${status ? `?status=${status}` : ''}`);

export const createClient = (data: object) =>
  authFetch('/admin/clients', { method: 'POST', body: JSON.stringify(data) });

export const updateClient = (id: string, data: object) =>
  authFetch(`/admin/clients/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deleteClient = (id: string) =>
  authFetch(`/admin/clients/${id}`, { method: 'DELETE' });

// Payments
export const recordPayment = (clientId: string, data: object) =>
  authFetch(`/admin/clients/${clientId}/payments`, { method: 'POST', body: JSON.stringify(data) });

export const getPaymentHistory = (clientId: string) =>
  authFetch(`/admin/clients/${clientId}/payments`);

// Reminders
export const getReminders = () => authFetch('/admin/reminders');

// Plans
export const getAdminPlans = () => authFetch('/admin/plans');

export const createPlan = (data: object) =>
  authFetch('/admin/plans', { method: 'POST', body: JSON.stringify(data) });

export const updatePlan = (id: string, data: object) =>
  authFetch(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) });

export const deletePlan = (id: string) =>
  authFetch(`/admin/plans/${id}`, { method: 'DELETE' });
