/**
 * API Configuration Constants
 * 
 * Centralized API endpoints configuration for the SeniorGo application.
 * Update the base URLs here to change them across the entire application.
 */

// Environment-specific configuration
const isDevelopment = __DEV__ || process.env.NODE_ENV === 'development';

// Base URLs for different services
export const API_BASE_URLS = {
  AUTH_SERVICE: 'https://230d71c19c03.ngrok-free.app',
  MAIN_SERVICE: 'https://230d71c19c03.ngrok-free.app',
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: `${API_BASE_URLS.AUTH_SERVICE}/login`,
  ADMIN_LOGIN: `${API_BASE_URLS.AUTH_SERVICE}/adminLogin`,
  
  // Main service endpoints
  FORGOT_PASSWORD: `${API_BASE_URLS.MAIN_SERVICE}/forgotPassword`,
  CHANGE_PASSWORD: `${API_BASE_URLS.MAIN_SERVICE}/changePassword`,
  SIGNUP_SENIOR: `${API_BASE_URLS.MAIN_SERVICE}/signUpSenior`,
  SIGNUP_VOLUNTEER: `${API_BASE_URLS.MAIN_SERVICE}/signUpVolunteer`,
  CREATE_GROUP: `${API_BASE_URLS.MAIN_SERVICE}/createGroup`,
  REQUEST_RIDE: `${API_BASE_URLS.MAIN_SERVICE}/requestRide`,
  ACTIVE_REQUESTS: `${API_BASE_URLS.MAIN_SERVICE}/activeRequests`,
  ACCEPTED_REQUESTS: `${API_BASE_URLS.MAIN_SERVICE}/acceptedRequests`,
  ACCEPT_REQUESTS: `${API_BASE_URLS.MAIN_SERVICE}/acceptRequests`,
  CURRENT_RIDES: `${API_BASE_URLS.MAIN_SERVICE}/currentRides`,
  UPDATE_STATUS: `${API_BASE_URLS.MAIN_SERVICE}/updateStatus`,
  UPDATE_STATUS_BAR: `${API_BASE_URLS.MAIN_SERVICE}/updateStatusBar`,
} as const;

// Common headers
export const API_HEADERS = {
  'Content-Type': 'application/json',
} as const;

// API request helper functions
export const createApiRequest = (endpoint: string, options: RequestInit = {}) => {
  return fetch(endpoint, {
    headers: {
      ...API_HEADERS,
      ...options.headers,
    },
    ...options,
  });
};

// Export individual base URLs for backward compatibility
export const AUTH_BASE_URL = API_BASE_URLS.AUTH_SERVICE;
export const MAIN_BASE_URL = API_BASE_URLS.MAIN_SERVICE;
