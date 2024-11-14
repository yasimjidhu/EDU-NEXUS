import axios from 'axios'

const refreshToken = async (refreshToken: string) => {
    try {
        const response = await axios.post('https://mcartecommerce.online/auth/refresh-token', { refreshToken });
        const { access_token } = response.data;

        // Update cookies with refreshed access token
        document.cookie = `access_token=${access_token}; Secure; SameSite=Strict`;

        console.log('Token refreshed successfully');
        return access_token;
    } catch (error:any) {
        console.error('Error refreshing token:', error.message);
        throw error;
    }
};

export default refreshToken