const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Strips /api from base URL to get the root for static file serving
const STATIC_BASE = BASE_URL.replace(/\/api$/, '');

export function getImageUrl(url: string | null | undefined): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  // Remove leading slash if present to avoid double slashes
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
  return `${STATIC_BASE}/${cleanUrl}`;
}

async function fetchWithTimeout(url: string, options: any = {}) {
  const { timeout = 8000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function fetchTransformations() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/transformations`);
    if (!res.ok) throw new Error('Failed to fetch transformations');
    return res.json();
  } catch (error) {
    console.error('API Error (fetchTransformations):', error);
    throw error;
  }
}

export async function fetchAbout() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/about`);
    if (!res.ok) throw new Error('Failed to fetch about content');
    return res.json();
  } catch (error) {
    console.error('API Error (fetchAbout):', error);
    throw error;
  }
}

export async function submitLead(data: { name: string; phone: string; goal?: string }) {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/leads`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      timeout: 60000 // 60 second timeout for cold starts
    });
    if (!res.ok) throw new Error('Failed to submit');
    return res.json();
  } catch (error) {
    console.error('API Error (submitLead):', error);
    throw error;
  }
}

export async function fetchPlans() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/plans`);
    if (!res.ok) throw new Error('Failed to fetch plans');
    return res.json();
  } catch (error) {
    console.error('API Error (fetchPlans):', error);
    throw error;
  }
}

export async function fetchHero() {
  try {
    const res = await fetchWithTimeout(`${BASE_URL}/hero`);
    if (!res.ok) throw new Error('Failed to fetch hero content');
    return res.json();
  } catch (error) {
    console.error('API Error (fetchHero):', error);
    throw error;
  }
}
