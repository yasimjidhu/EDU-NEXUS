import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';


interface RefreshTokenResponse {
  accessToken: string;
}

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

// Function to refresh the token
async function refreshToken(): Promise<string> {
  try {
    const response = await axios.post<RefreshTokenResponse>(
      'http://localhost:4000/auth/refresh-token',
      {},
      { withCredentials: true }
    );
    console.log('response of get refreshtoken',response)
    return response.data.accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Function to get the access token from cookies
function getAccessTokenFromCookies(): string | null {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token'));
  console.log('accesstoekn cookies',accessTokenCookie)
  if (accessTokenCookie) {
    return accessTokenCookie.split('=')[1];
  }
  return null;
}

// Request interceptor to add the access token to requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessTokenFromCookies();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refreshing
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        if (originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        // You might want to redirect to login or dispatch a logout action here
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;