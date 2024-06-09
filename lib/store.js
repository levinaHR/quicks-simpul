import inboxReducer from '@/lib/slices/inboxSlice';
import taskReducer from '@/lib/slices/taskSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    inbox: inboxReducer,
    task: taskReducer,
  },
});
