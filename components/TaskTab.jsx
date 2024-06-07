'use client';

import {
  fetchAllTask,
  getAllTask,
  getTaskError,
  getTaskStatus,
  insertNewTask,
} from '@/lib/slices/taskSlice';
import ArrowDown from '@/public/icon/arrow-down.svg';
import {
  Button,
  Collapse,
  List,
  ListItem,
  Spinner,
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import TaskItem from './TaskItem';

function TaskFilter({ label, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-fit ml-16 flex flex-col items-center">
      <button
        className="w-fit px-[14px] py-[10px] flex gap-2 items-center rounded-md border border-primary-gray-100
                    transition duration-150 ease-in-out focus:bg-primary-gray-50 active:bg-primary-gray-50"
        onClick={() => setOpen(!open)}
        onBlur={() => setOpen(false)}
      >
        <p className="font-semibold text-primary-gray-200">{label}</p>
        <div className="relative w-5 h-5">
          <Image src={ArrowDown} alt="img" layout="fill" objectFit="cover" />
        </div>
      </button>
      <Collapse open={open} className="absolute top-14 z-10 w-fit">
        <List
          className={`p-0 flex gap-0 text-sm font-semibold text-primary-gray-200 rounded-md overflow-hidden divide-y divide-primary-gray-100 border border-primary-gray-100 bg-white transition duration-150 ease-in-out`}
        >
          {children}
        </List>
      </Collapse>
    </div>
  );
}
export default function TaskTab() {
  const dispatch = useDispatch();

  const taskList = useSelector(getAllTask);
  const taskStatus = useSelector(getTaskStatus);
  const taskError = useSelector(getTaskError);

  useEffect(() => {
    if (taskStatus === 'idle') {
      dispatch(fetchAllTask());
    }
  }, [dispatch, taskStatus]);

  const handleAddNewTask = () => {
    dispatch(
      insertNewTask({
        isNew: true,
        title: null,
        description: null,
        deadline: moment(new Date()).format('DD/MM/YYYY'),
        completed: false,
      })
    );
  };

  return (
    <>
      {/* Filter & Create Task Button */}
      <div className="flex justify-between">
        <TaskFilter open={open} label="My Task">
          <ListItem className="p-0 px-4 py-2 rounded-none">
            Personal Errands
          </ListItem>
          <ListItem className="p-0 px-4 py-2 rounded-none">
            Urgent To-Do
          </ListItem>
        </TaskFilter>

        <Button className="px-4 bg-primary" onClick={handleAddNewTask}>
          New Task
        </Button>
      </div>

      {/* Task List */}
      {(taskStatus === 'idle' || taskStatus === 'loading') && (
        <div className="flex flex-col gap-3 items-center my-auto">
          <Spinner color="blue-gray" className="h-12 w-12" />
          <p className="font-semibold">Loading Task List...</p>
        </div>
      )}
      {taskStatus === 'failed' && (
        <div className="flex flex-col gap-3 items-center my-auto">
          <p className="!text-4xl font-semibold text-i-red">!</p>
          <p className="font-semibold text-i-red">An error occured</p>
        </div>
      )}
      {taskStatus === 'succeeded' && (
        <div className="divide-y divide-primary-gray-100">
          {taskList
            .slice()  // creating copy of taskList to avoid mutating original state due to reverse function
            .reverse()
            .map((task, i) => (
              <TaskItem key={i} item={task} />
            ))}
        </div>
      )}
    </>
  );
}
