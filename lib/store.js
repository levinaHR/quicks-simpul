import taskReducer from '@/lib/slices/taskSlice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    task: taskReducer,
  },
});
