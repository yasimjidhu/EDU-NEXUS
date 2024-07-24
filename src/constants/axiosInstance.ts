import axios, { AxiosInstance, AxiosError, AxiosRequestConfig } from 'axios';

interface RefreshTokenResponse {
  access_token: string;
}

export const 
axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://localhost:4000',
  withCredentials: true,
});

// Function to refresh the token
async function refreshToken(): Promise<string> {
  const refresh_token = localStorage.getItem('refresh_token');
  if (!refresh_token) {
    console.log('no refreshtoken')
    // Redirect to login page if refresh token is missing
    window.location.href = '/login'; 
    throw new Error('No refresh token found');
  }
  
  try {
    const response = await axios.post<RefreshTokenResponse>(
      'http://localhost:4000/auth/refresh-token',
      { refresh_token },
      { withCredentials: true }
    );
    // Update the access token cookie
    document.cookie = `access_token=${response.data.access_token}; path=/`;
    console.log('response of get refreshtoken',response.data)
    return response.data.access_token;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
}

// Function to get the access token from cookies
function getAccessTokenFromCookies(): string | null {
  const cookies = document.cookie.split(';').map(cookie => cookie.trim());
  const accessTokenCookie = cookies.find(cookie => cookie.startsWith('access_token='));
  if (accessTokenCookie) {
    return accessTokenCookie.split('=')[1];
  }
  return null;
}

// Request interceptor to add the access token to requests
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = getAccessTokenFromCookies();
    if (!token) {
      token = await refreshToken(); // Refresh token if access token is undefined
    }
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refreshing
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error: AxiosError) => {
//     const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       try {
//         const newToken = await refreshToken();
//         if (newToken && originalRequest.headers) {
//           originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
//           return axiosInstance(originalRequest);
//         }
//       } catch (refreshError) {
//         console.error('Failed to refresh token:', refreshError);
//       }
//     }
//     return Promise.reject(error);
//   }
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newToken = await refreshToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
      }
    } else if (error.response?.status === 403) {
      console.log('error in instance',error)
      const errorMessage:any = error.response.data.message;
      if (errorMessage === 'Unauthorized' || errorMessage === 'You are blocked by the respective authority') {
        // Clear cookies or local storage as needed
        document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
