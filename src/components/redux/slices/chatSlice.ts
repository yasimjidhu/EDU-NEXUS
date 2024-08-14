import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../constants/axiosInstance';
import {Group, TStudent} from '../../../types/chat'
import { Message } from '../../../types/chat';


export interface ChatState {
  messages: Message[];
  messagedStudents:TStudent[];
  group?:Group | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  messagedStudents:[],
  group:null,
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message:Message, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/chat/message', message);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/messages/${conversationId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getMessagedStudents = createAsyncThunk(
  'chat/getMessagedStudents',
  async (instructorId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/messaged-students/${instructorId}`);
      console.log('messaged students are',response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const createGroup = createAsyncThunk(
  'chat/createGroup',
  async (groupData: Omit<Group, '_id'>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/chat/group', groupData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getGroup = createAsyncThunk(
  'chat/getGroup',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/group/${groupId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getUserJoinedGroups = createAsyncThunk(
  'chat/getGroup',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/joined-groups/${userId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const getGroupMessages = createAsyncThunk(
  'chat/group-messages',
  async (groupId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/chat/group-messages/${groupId}`);
      console.log('response of getGroupMessages in slice',response)
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addUsersToGroup = createAsyncThunk(
  'groups/addUsersToGroup',
  async ({ groupId, userIds }: {groupId:string,userIds:string[]}, { rejectWithValue }) => {
    try {
      console.log('add users to group called in slice',userIds)
      const response = await axiosInstance.post(`/chat/addToGroup/${groupId}`, { userIds });
      return response.data;
    } catch (error:any) {
      return rejectWithValue(error.response?.data || 'Failed to add users');
    }
  }
);

export const removeUserFromGroup = createAsyncThunk(
  'groups/removeUserFromGroup',
  async ({ groupId, userId }: { groupId: string, userId: string }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/chat/group/leave`,{
        params:{groupId,userId}
      });
      return { groupId, userId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to remove user');
    }
  }
);


const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    updateMessageStatus:(state,action:PayloadAction<Message>)=>{
      const index = state.messages.findIndex((msg:any)=>msg._id == action.payload._id)
      if(index !== -1){
        state.messages[index] = action.payload
      }
    },
    clearMessages: (state) => {
      state.messages = [];
    },
    clearGroup: (state) => {
      state.group = null;
    },
    removeUser: (state, action: PayloadAction<{ groupId: string; userId: string }>) => {
      if (state.group && state.group._id === action.payload.groupId) {
        state.group.members = state.group.members.filter(id => id !== action.payload.userId);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMessage.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(getMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getMessagedStudents.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMessagedStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.messagedStudents = action.payload;
      })
      .addCase(getMessagedStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(createGroup.fulfilled, (state, action: PayloadAction<Group>) => {
        state.loading = false;
        state.group = action.payload;
      })
      .addCase(createGroup.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;  
        state.error = action.payload || 'Failed to create group';
      })
      .addCase(getGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroup.fulfilled, (state, action: PayloadAction<Group>) => {
        state.loading = false;
        state.group = action.payload;
      })
      .addCase(getGroup.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch group';
      })
      .addCase(removeUserFromGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUserFromGroup.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, userId } = action.payload;

        if (state.group && state.group._id === groupId) {
          state.group.members = state.group.members ? state.group.members.filter(id => id !== userId) : [];
        }
      })
      .addCase(removeUserFromGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});



export const { addMessage, clearMessages,updateMessageStatus,clearGroup } = chatSlice.actions;

export default chatSlice.reducer;