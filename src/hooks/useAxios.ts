import { useState, useCallback } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

interface UseAxiosProps {
  url: string;
  method: HttpMethod;
  body?: any;
  config?: AxiosRequestConfig;
}

interface UseAxiosResponse<T = any> {
  response: T | null;
  error: string | null;
  loading: boolean;
  sendRequest: (overrideConfig?: AxiosRequestConfig) => Promise<void>;
}

export const useAxios = <T = any>({
  url,
  method,
  body = null,
  config = {},
}: UseAxiosProps): UseAxiosResponse<T> => {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const sendRequest = useCallback(
    async (overrideConfig: AxiosRequestConfig = {}) => {
      setLoading(true);
      try { 
        const res: AxiosResponse<T> = await axios({
          url,
          method,
          data: body,
          ...config,
          ...overrideConfig,
        });
        console.log('response of upload image in use axios',res)
        setResponse(res.data);
        setError(null);
      } catch (err) {
        const axiosError = err as AxiosError;
        setError(axiosError.message);
        setResponse(null);
      } finally {
        setLoading(false);
      }
    },
    [url, method, body, config]
  );

  return { response, error, loading, sendRequest };
};
