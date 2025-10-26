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
  MAIN_SERVICE: 'https://seniorgoserver.onrender.com'
} as const;

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication endpoints
  LOGIN: `${API_BASE_URLS.MAIN_SERVICE}/login`,
  ADMIN_LOGIN: `${API_BASE_URLS.MAIN_SERVICE}/adminLogin`,
  
  // Main service endpoints
  FORGOT_PASSWORD: `${API_BASE_URLS.MAIN_SERVICE}/forgotPassword`,
  CHANGE_PASSWORD: `${API_BASE_URLS.MAIN_SERVICE}/changePassword`,
  SIGNUP_SENIOR: `${API_BASE_URLS.MAIN_SERVICE}/signUpSenior`,
  SIGNUP_VOLUNTEER: `${API_BASE_URLS.MAIN_SERVICE}/signUpVolunteer`,
  CREATE_GROUP: `${API_BASE_URLS.MAIN_SERVICE}/createGroup`,
  CREATE_ADMIN_GROUP: `${API_BASE_URLS.MAIN_SERVICE}/createAdminGroup`,
  GET_ALL_GROUPS: `${API_BASE_URLS.MAIN_SERVICE}/getAllGroups`,
  DELETE_GROUP: `${API_BASE_URLS.MAIN_SERVICE}/deleteGroup`,
  DEACTIVATE_GROUP: `${API_BASE_URLS.MAIN_SERVICE}/deactivateGroup`,
  GET_ALL_ADMIN_USERS: `${API_BASE_URLS.MAIN_SERVICE}/getAllGroupAdminUsers`,
  DEACTIVATE_ADMIN_USER: `${API_BASE_URLS.MAIN_SERVICE}/deactivateAdminUser`,
  REQUEST_RIDE: `${API_BASE_URLS.MAIN_SERVICE}/requestRide`,
  REQUEST_RECURRING_RIDE: `${API_BASE_URLS.MAIN_SERVICE}/requestRecurringRide`,
  ACTIVE_REQUESTS: `${API_BASE_URLS.MAIN_SERVICE}/activeRequests`,
  ACCEPTED_REQUESTS: `${API_BASE_URLS.MAIN_SERVICE}/acceptedRequests`,
  ACCEPT_REQUESTS: `${API_BASE_URLS.MAIN_SERVICE}/acceptRequests`,
  CURRENT_RIDES: `${API_BASE_URLS.MAIN_SERVICE}/currentRides`,
  UPDATE_STATUS: `${API_BASE_URLS.MAIN_SERVICE}/updateStatus`,
  UPDATE_STATUS_BAR: `${API_BASE_URLS.MAIN_SERVICE}/updateStatusBar`,
  CANCEL_RIDE: `${API_BASE_URLS.MAIN_SERVICE}/cancelRide`,
  GET_VOLUNTEER_INFO: `${API_BASE_URLS.MAIN_SERVICE}/getVolunteerInfo`,
  GET_SENIOR_INFO: `${API_BASE_URLS.MAIN_SERVICE}/getSeniorsInfo`,
  GET_RIDES_INFO: `${API_BASE_URLS.MAIN_SERVICE}/getRidesInfo`,
  GET_RIDER_INFO: `${API_BASE_URLS.MAIN_SERVICE}/getRiderInfo`,
  UPDATE_RIDER_INFO: `${API_BASE_URLS.MAIN_SERVICE}/updateRiderInfo`,
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
export const AUTH_BASE_URL = API_BASE_URLS.MAIN_SERVICE;
export const MAIN_BASE_URL = API_BASE_URLS.MAIN_SERVICE;
