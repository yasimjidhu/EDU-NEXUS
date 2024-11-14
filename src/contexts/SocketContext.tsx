import { RootState } from '../components/redux/store/store';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io, { Socket } from 'socket.io-client';

const SocketContext = createContext<{ socket: Socket | null, onlineUsers: {[key:string]:string} }>({ socket: null, onlineUsers: {} });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<{ [key: string]: string }>({});

  const {user} = useSelector((state:RootState)=>state.user)

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');

    const newSocket = io('https://mcartecommerce.online', {
      path:'/chat/socket.io',
      auth: { token },
      transports: ['websocket','polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000  
    });

    newSocket.on('connect', () => {
      console.log('Connected to websocket server');
      setSocket(newSocket);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    newSocket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    newSocket.on('userStatus', ({ email, status }) => {
      setOnlineUsers((prev) => ({ ...prev, [email]: status }));
    });

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, [user?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
