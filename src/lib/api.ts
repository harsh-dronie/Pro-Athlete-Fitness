const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Strips /api from base URL to get the root for static file serving
const STATIC_BASE = BASE_URL.replace(/\/api$/, '');

export function getImageUrl(url: string): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STATIC_BASE}/${url}`;
}

export async function fetchTransformations() {
  const res = await fetch(`${BASE_URL}/transformations`);
  if (!res.ok) throw new Error('Failed to fetch transformations');
  return res.json();
}

export async function fetchAbout() {
  const res = await fetch(`${BASE_URL}/about`);
  if (!res.ok) throw new Error('Failed to fetch about content');
  return res.json();
}

export async function submitLead(data: { name: string; phone: string; goal?: string }) {
  const res = await fetch(`${BASE_URL}/leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    signal: AbortSignal.timeout(60000), // 60 second timeout for cold starts
  });
  if (!res.ok) throw new Error('Failed to submit');
  return res.json();
}

export async function fetchPlans() {
  const res = await fetch(`${BASE_URL}/plans`);
  if (!res.ok) throw new Error('Failed to fetch plans');
  return res.json();
}

export async function fetchHero() {
  const res = await fetch(`${BASE_URL}/hero`);
  if (!res.ok) throw new Error('Failed to fetch hero content');
  return res.json();
}
