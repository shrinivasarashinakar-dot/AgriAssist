import axios from 'axios';

// Determine baseURL robustly. If the env var is missing, malformed, or was set like
// 'REACT_APP_API_URL=https://...' (including the key by mistake), use the fallback.
const envUrl = process.env.REACT_APP_API_URL;
const isValidAbsoluteUrl = (u) => typeof u === 'string' && /^https?:\/\//i.test(u);
const looksMisconfigured = (u) => typeof u === 'string' && /^REACT_APP_/i.test(u);
const resolvedBaseURL = isValidAbsoluteUrl(envUrl) && !looksMisconfigured(envUrl)
  ? envUrl
  : 'https://agri-assist-9t3e.onrender.com/api/';

const API = axios.create({
  baseURL: resolvedBaseURL,
});

// Farmer login
export const farmerLogin = (data) => API.post('farmer-login/', data);

// Market prices
export const getMarketPrices = (params) => API.get('market-prices/', { params });

// Crop advisory
export const predictCrop = (payload) => API.post('predict-crop/', payload);

// Marketplace API
export const fetchListings = () => API.get('marketplace/');
export const getListingDetail = (id) => API.get(`marketplace/${id}/`);
export const createListing = (formData) =>
  API.post('marketplace/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const updateListing = (id, formData) =>
  API.put(`marketplace/${id}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
export const deleteListing = (id) => API.delete(`marketplace/${id}/`);

export const getQuickTips = () => API.get('quicktips/');

// Ask AI (Gemini proxy)
export const askAI = (question) => API.post('ask-ai/', { question });
