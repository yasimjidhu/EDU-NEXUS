import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axiosInstance from '../../../constants/axiosInstance';
import { Group, TStudent, UnreadMessage } from '../../../types/chat'
import { Message } from '../../../types/chat';


export interface ChatState {
  messages: Message[];
  messagedStudents: TStudent[];
  unreadMessages: UnreadMessage[];
  group?: Group | null;
  groups?: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  messagedStudents: [],
  unreadMessages: [],
  group: null,
  groups: [],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: Message, { rejectWithValue }) => {
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

export const getUnreadMessages = createAsyncThunk(
  'chat/get-unread-messages',
  async (userId: string, { rejectWithValue }) => {
    try {
      console.log('get unreade messages called in slice', userId)
      const response = await axiosInstance.get(`/chat/unread-messages/${userId}`);
      console.log('respnose of unread in slice', response)
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
  'chat/getJoinedGroups',
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
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const addUsersToGroup = createAsyncThunk(
  'groups/addUsersToGroup',
  async ({ groupId, userIds }: { groupId: string, userIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/chat/addToGroup/${groupId}`, { userIds });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || 'Failed to add users');
    }
  }
);

export const removeUserFromGroup = createAsyncThunk(
  'groups/removeUserFromGroup',
  async ({ groupId, userId }: { groupId: string, userId: string }, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/chat/group/leave`, {
        params: { groupId, userId }
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
    updateMessageStatus: (state, action: PayloadAction<Message>) => {
      console.log('update message status reached', action.payload)
      const index = state.messages.findIndex((msg: any) => msg._id == action.payload._id)
      if (index !== -1) {
        state.messages[index].status = action.payload.status
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
    },
    setGroups: (state, action: PayloadAction<Group[]>) => {
      state.groups = action.payload
    },
    removeGroup: (state, action: PayloadAction<string>) => {
      state.groups = state.groups?.filter(group => group._id !== action.payload)

      if (state.group && state.group._id == action.payload) {
        state.group = null;
        state.messages = []
      }
    },
    markConversationAsRead: (state, action: PayloadAction<{ conversationId: string, item: 'user' | 'group' | '' }>) => {
      const { conversationId, item } = action.payload;

      // Find the conversation based on the item type
      let conversation;
      if (item === 'group') {
        conversation = state.unreadMessages.find((msg) => msg._id == conversationId)
      } else if (item === 'user') {
        conversation = state.unreadMessages.find((msg) => msg._id == conversationId)
      }

      const index = state.unreadMessages.findIndex((msg) => msg._id === conversationId && msg.latestMessage);

      if (index !== -1) {
        // Remove the unread message from the array
        state.unreadMessages.splice(index, 1);
      }


      if (conversation) {
        conversation.unreadCount = 0
      }
    },


    clearUnreadMessages: (state) => {
      state.unreadMessages = [];
    },
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
      .addCase(getUnreadMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUnreadMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.unreadMessages = action.payload;
      })
      .addCase(getUnreadMessages.rejected, (state, action) => {
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
      .addCase(createGroup.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.group = action.payload.group;
        state.groups?.push(action.payload)
      })
      .addCase(createGroup.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create group';
      })
      .addCase(addUsersToGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(addUsersToGroup.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log('payload of adduser to group in reducer', action.payload)

        // Update the specific group in the groups array, if it exists
        if (state.groups) {
          const groupIndex = state.groups.findIndex(group => group._id === action.payload.group._id);

          if (groupIndex !== -1) {
            // Update the existing group in the array
            state.groups[groupIndex] = action.payload.group;
          } else {
            // Add the new group to the array if it doesn't exist
            state.groups.push(action.payload.group);
          }
        } else {
          // Initialize groups array with the new group
          state.groups = [action.payload.group];
        }

        // Update the state.group if needed
        state.group = action.payload.group;
      })
      .addCase(addUsersToGroup.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || 'Failed to create group';
      })
      .addCase(getGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGroup.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.group = action.payload.group
      })
      .addCase(getGroup.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch group';
      })
      .addCase(getUserJoinedGroups.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserJoinedGroups.fulfilled, (state, action) => {
        state.loading = false;
        state.groups = action.payload.groups;
      })
      .addCase(getUserJoinedGroups.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(removeUserFromGroup.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeUserFromGroup.fulfilled, (state, action) => {
        state.loading = false;
        const { groupId, userId } = action.payload;

        // Remove the user from the group's members list
        if (state.group && state.group._id === groupId) {
          state.group.members = state.group.members.filter(id => id !== userId);
        }

        // Remove the group from the list of groups
        state.groups = state.groups?.filter(group => group._id !== groupId);

        console.log('Updated groups:', state.groups);
      })
      .addCase(removeUserFromGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});



export const { addMessage, clearMessages, updateMessageStatus, clearGroup, markConversationAsRead, clearUnreadMessages } = chatSlice.actions;

export default chatSlice.reducer;