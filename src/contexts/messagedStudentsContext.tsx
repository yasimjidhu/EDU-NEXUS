import React, { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMessagedStudents } from '../components/redux/slices/chatSlice';
import { AppDispatch, RootState } from '../components/redux/store/store';
import { User } from '../types/user';

interface MessagedStudentsContextType {
  messagedStudents: User[];
  loading: boolean;
}

const MessagedStudentsContext = createContext<MessagedStudentsContextType | undefined>(undefined);

export const MessagedStudentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messagedStudents, setMessagedStudents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const dispatch: AppDispatch = useDispatch();
  const {user} = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (user?._id) {
      const fetchMessagedStudents = async () => {
        setLoading(true);
        try {
          const action = await dispatch(getMessagedStudents(user._id));
          if (action.type === getMessagedStudents.fulfilled.type) {
            setMessagedStudents(action.payload);
          }
        } catch (error) {
          console.error('Failed to fetch messaged students:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchMessagedStudents();
    }
  }, [dispatch, user?._id]);
  console.log('messaged students in context',messagedStudents)
  return (
    <MessagedStudentsContext.Provider value={{ messagedStudents, loading }}>
      {children}
    </MessagedStudentsContext.Provider>
  );
};

export const useMessagedStudents = () => {
  const context = useContext(MessagedStudentsContext);
  if (context === undefined) {
    throw new Error('useMessagedStudents must be used within a MessagedStudentsProvider');
  }
  return context;
};
