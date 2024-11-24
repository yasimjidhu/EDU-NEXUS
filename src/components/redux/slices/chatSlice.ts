
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Group, TStudent, UnreadMessage } from '../../../types/chat'
import { Message } from '../../../types/chat';
import axios from 'axios';


export interface ChatState {
  messages: Message[];
  messagedStudents: TStudent[];
  unreadMessages: UnreadMessage[];
  unreadGroupMessages: Record<string, number>;
  unreadCounts: Record<string, number>;
  group?: Group | null;
  groups?: Group[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  messages: [],
  messagedStudents: [],
  unreadMessages: [],
  unreadGroupMessages: {},
  unreadCounts: {},
  group: null,
  groups: [],
  loading: false,
  error: null,
};

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async (message: Message, { rejectWithValue }) => {
    try {
      console.log('send message called', message)
      const response = await axios.post('https://chat-service-hcpy.onrender.com/chat/message', message);
      return response.data;
    } catch (error: any) {
      console.log(error)
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


export const getMessages = createAsyncThunk(
  'chat/getMessages',
  async (conversationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://chat-service-hcpy.onrender.com/chat/messages/${conversationId}`,{withCredentials:true});
      console.log('response data of getmessages', response.data)
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
      const response = await axios.get(`https://chat-service-hcpy.onrender.com/chat/unread-messages/${userId}`,{withCredentials:true});
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
      const response = await axios.get(`https://chat-service-hcpy.onrender.com/chat/messaged-students/${instructorId}`,{
        withCredentials:true
      });
      console.log('response of messaged students fetch', response)
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
      const response = await axios.post('https://chat-service-hcpy.onrender.com/chat/group', groupData,
        {withCredentials:true});
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
      const response = await axios.get(`https://chat-service-hcpy.onrender.com/chat/group/${groupId}`,{
        withCredentials:true
      });
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
      const response = await axios.get(`https://chat-service-hcpy.onrender.com/chat/joined-groups/${userId}`,
        { withCredentials: true });
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
      const response = await axios.get(`https://chat-service-hcpy.onrender.com/chat/group-messages/${groupId}`,{withCredentials:true});
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
      const response = await axios.post(`https://chat-service-hcpy.onrender.com/chat/addToGroup/${groupId}`, { userIds },{withCredentials:true});
      console.log('response of add user to group', response.data)
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
      console.log('')
      const response = await axios.delete(`https://chat-service-hcpy.onrender.com/chat/group/leave`, {
        withCredentials: true, 
        params: { groupId, userId },
      });
      console.log('response of reomve user frmo grtoups', response.data)
      return response.data.group
    } catch (error: any) {
      console.log('error while removing user from group', error)
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
    deleteMessage: (state, action) => {
      const messageId = action.payload;
      // Remove the message from the messages array
      state.messages = state.messages.filter(
        (message) => message._id !== messageId.toString()
      );
    },
    updateMessageStatus: (state, action: PayloadAction<Message>) => {
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
      state.unreadCounts[conversationId] = 0;
    },
    incrementUnreadCount: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      if (!state.unreadCounts[conversationId]) {
        state.unreadCounts[conversationId] = 1;
      } else {
        state.unreadCounts[conversationId] += 1;
      }
    },
    decrementUnreadCount: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      if (!state.unreadCounts[conversationId]) {
        state.unreadCounts[conversationId] = 0;
      } else {
        state.unreadCounts[conversationId] -= 1;
      }
    },
    resetUnreadCount: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      if (state.unreadCounts[conversationId]) {
        state.unreadCounts[conversationId] = 0;  // Reset unread count to 0
      }
    },

    updateUnreadMessages: (state, action: PayloadAction<Message>) => {
      console.log('update unread messages reached', action.payload)
      const newMessage = action.payload;
      const existingUnreadMessage = state.unreadMessages.find(
        (msg) => msg.conversationId === newMessage.conversationId
      );
      console.log('existingUnreadMessage is ', existingUnreadMessage)
      if (existingUnreadMessage) {
        // Update the latest message and increment unread count
        existingUnreadMessage.latestMessage = {
          _id: newMessage._id!,
          senderId: newMessage.senderId,
          senderName: newMessage.senderName!,
          senderProfile: newMessage.senderProfile!,
          text: newMessage.text || null,
          fileUrl: newMessage.fileUrl || null,
          fileType: newMessage.fileType || null,
          createdAt: newMessage.createdAt?.toString() || '',
        };
        existingUnreadMessage.unreadCount += 1;
      } else {
        // Add a new unread message entry
        state.unreadMessages.push({
          conversationId: newMessage.conversationId,
          unreadCount: 1,
          latestMessage: {
            _id: newMessage._id!,
            senderId: newMessage.senderId,
            senderName: newMessage.senderName!,
            senderProfile: newMessage.senderProfile!,
            text: newMessage.text || null,
            fileUrl: newMessage.fileUrl || null,
            fileType: newMessage.fileType || null,
            createdAt: newMessage.createdAt?.toString() || '',
          },
        });
      }
    },
    deleteMessageFromUnreadMessages: (state, action: PayloadAction<Message>) => {
      state.unreadMessages.filter(msg => msg._id !== action.payload._id)
    },

    clearUnreadMessages: (state) => {
      state.unreadMessages = [];
    },
    addGroupMessage: (state, action: PayloadAction<Message>) => {
      const message = action.payload;
      const { conversationId } = message;

      // Find the existing unread message entry
      const existingUnread = state.unreadMessages.find(
        (msg) => msg.conversationId === conversationId
      );

      if (existingUnread) {
        // Update the unread count and latest message
        existingUnread.unreadCount += 1;
        existingUnread.latestMessage = {
          _id: message._id || "",
          senderId: message.senderId,
          senderName: message.senderName || "",
          senderProfile: message.senderProfile || "",
          text: message.text || null,
          fileUrl: message.fileUrl || null,
          fileType: message.fileType || null,
          createdAt: message.createdAt?.toISOString() || "",
        };
      } else {
        // Add new unread message entry
        state.unreadMessages.push({
          conversationId,
          unreadCount: 1,
          latestMessage: {
            _id: message._id || "",
            senderId: message.senderId,
            senderName: message.senderName || "",
            senderProfile: message.senderProfile || "",
            text: message.text || null,
            fileUrl: message.fileUrl || null,
            fileType: message.fileType || null,
            createdAt: message.createdAt?.toISOString() || "",
          },
        });
      }
    },
    updateGroupUnreadCount: (state, action: PayloadAction<string>) => {
      const groupId = action.payload;
      state.unreadGroupMessages[groupId] = (state.unreadGroupMessages[groupId] || 0) + 1;
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
        state.groups?.push(action.payload.group)
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
        console.log('state groups are', state.groups)

        // Update the specific group in the groups array, if it exists
        if (state.groups) {
          const groupIndex = state.groups.findIndex(group => group._id === action.payload.group._id);
          console.log('group index is', groupIndex)
          if (groupIndex !== -1) {
            // Update the existing group in the array
            state.groups[groupIndex] = action.payload.group;
            console.log('group at that index', state.groups[groupIndex])
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
        console.log('action payload of remove user in slice', action.payload);

        // Update the members list in the specific group
        if (state.group && state.group._id === action.payload._id) {
          state.group.members = action.payload.members; // Use the updated members list from the payload
        }

        // Update the specific group in the groups list
        if (state.groups) {
          state.groups = state.groups.map(group =>
            group._id === action.payload._id
              ? { ...group, members: action.payload.members }
              : group
          );
        }

        console.log('Updated groups:', state.groups);
      })
      .addCase(removeUserFromGroup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

  },
});



export const {
  addMessage,
  clearMessages,
  updateMessageStatus,
  clearGroup,
  markConversationAsRead,
  clearUnreadMessages,
  incrementUnreadCount,
  decrementUnreadCount,
  resetUnreadCount,
  updateUnreadMessages,
  addGroupMessage,
  updateGroupUnreadCount,
  deleteMessage,
  deleteMessageFromUnreadMessages

} = chatSlice.actions;

export default chatSlice.reducer;