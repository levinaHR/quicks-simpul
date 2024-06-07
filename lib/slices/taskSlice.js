import { createAsyncThunk, createSlice, current } from '@reduxjs/toolkit';
import axios from 'axios';

const TASK_URL = '/api/task';

const initialState = {
  taskList: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const fetchAllTask = createAsyncThunk('task/fetchAllTask', async () => {
  const response = await axios.get(TASK_URL);
  return response.data;
});

export const createTask = createAsyncThunk('task/createTask', async (task) => {
  const { isNew, index, ...rest } = task;
  const response = await axios.post(TASK_URL, rest);
  return { ...response.data, index };
});

export const updateTask = createAsyncThunk('task/updateTask', async (task) => {
  const response = await axios.patch(TASK_URL, task);
  return response.data;
});

export const deleteTask = createAsyncThunk('task/deleteTask', async (task) => {
  const response = await axios.delete(TASK_URL, { data: task });
  return response.data;
});

const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    insertNewTask: (state, action) => {
      state.taskList.push({
        ...action.payload,
        index: state.taskList.length, // to keep track of the order for replacing in createTask.fulfilled
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllTask.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllTask.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.taskList = action.payload;
      })
      .addCase(fetchAllTask.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.taskList = state.taskList.map((task) => {
          if (task.index === action.payload.index) {
            return action.payload;
          }
          return task;
        });
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.taskList = state.taskList.map((task) => {
          if (task.id === action.payload.id) {
            return action.payload;
          }
          return task;
        });
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.taskList.splice(
          state.taskList.findIndex((task) => task.id === action.payload.id),
          1
        );
      });
  },
});

export const getAllTask = (state) => state.task.taskList;
export const getTaskStatus = (state) => state.task.status;
export const getTaskError = (state) => state.task.error;

export const { insertNewTask } = taskSlice.actions;

export default taskSlice.reducer;
