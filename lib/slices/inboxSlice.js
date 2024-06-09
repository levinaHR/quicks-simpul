import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import axios from 'axios';

const INBOX_URL = '/api/inbox';

const initialState = {
  openedChat: null,
  chatGroupList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchAllChatGroup = createAsyncThunk(
  'inbox/fetchAllChatGroup',
  async () => {
    const response = await axios.get(INBOX_URL);
    return response.data;
  }
);

export const updateChatlog = createAsyncThunk(
  'inbox/updateChatlog',
  async (chatGroup) => {
    const response = await axios.patch(INBOX_URL, chatGroup);
    return response.data;
  }
);

const inboxSlice = createSlice({
  name: 'inbox',
  initialState,
  reducers: {
    openChat: (state, action) => {
      state.openedChat = action.payload;
    },
    closeChat: (state) => {
      state.openedChat = null;
    },
    insertNewMessage: (state, action) => {
      state.openedChat.chatlog.push(action.payload);
    },
    removeMessage: (state, action) => {
      state.openedChat.chatlog.forEach((item, i) => {
        if (JSON.stringify(item) === JSON.stringify(action.payload)) {
          state.openedChat.chatlog.splice(i, 1);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllChatGroup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllChatGroup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.chatGroupList = action.payload;
      })
      .addCase(fetchAllChatGroup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(updateChatlog.fulfilled, (state, action) => {
        state.chatGroupList = state.chatGroupList.map((chatGroup) => {
          if (chatGroup.id === action.payload.id) {
            return action.payload;
          }
          return chatGroup;
        });
        state.openedChat = action.payload;
      });
  },
});

export const getAllChatGroup = (state) => state.inbox.chatGroupList;
export const getChatGroupStatus = (state) => state.inbox.status;
export const getChatGroupError = (state) => state.inbox.error;
export const getOpenedChat = (state) => state.inbox.openedChat;

export const { openChat, closeChat, insertNewMessage, removeMessage } =
  inboxSlice.actions;

export default inboxSlice.reducer;
