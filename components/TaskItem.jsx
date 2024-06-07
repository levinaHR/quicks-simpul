'use client';

import { createTask, deleteTask, updateTask } from '@/lib/slices/taskSlice';
import ArrowDown from '@/public/icon/arrow-down.svg';
import EditActive from '@/public/icon/edit-active.svg';
import Edit from '@/public/icon/edit.svg';
import ScheduleActive from '@/public/icon/schedule-active.svg';
import Schedule from '@/public/icon/schedule.svg';
import ThreeDots from '@/public/icon/three-dots.svg';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Checkbox,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
  Textarea,
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import DatePicker from './DatePicker';

export default function TaskItem({ item }) {
  const dispatch = useDispatch();

  const [task, setTask] = useState({});
  const [expandAccordion, setExpandAccordion] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editDesc, setEditDesc] = useState(false);

  useEffect(() => {
    setTask(item);
  }, [item]);

  const countDaysLeft = (deadline) => {
    const daysLeft = moment(deadline, 'DD/MM/YYYY').diff(
      moment().startOf('day'),
      'days'
    );

    if (daysLeft > 0) {
      return `${daysLeft} days left`;
    } else if (daysLeft === 0) {
      return 'Due today';
    } else {
      return 'Overdue';
    }
  };
  const handleExpandAccordion = () => {
    setExpandAccordion(!expandAccordion);
  };
  const handleOpenMore = () => {
    setOpenMore(!openMore);
  };

  const handleCreateTask = async () => {
    if (task.title) {
      await dispatch(createTask(task)).unwrap();
    }
  };
  const handleCheck = async () => {
    setTask({ ...task, completed: !task.completed });
    await dispatch(
      updateTask({ id: task.id, completed: !task.completed })
    ).unwrap();
  };
  const handleUpdateTitle = async () => {
    setEditTitle(false);
    await dispatch(updateTask({ id: task.id, title: task.title })).unwrap();
  };
  const handleUpdateDesc = async () => {
    if (!task.isNew) {
      setEditDesc(false);
      await dispatch(
        updateTask({ id: task.id, description: task.description })
      ).unwrap();
    }
  };
  const handleDeleteTask = async () => {
    setOpenMore(false);
    await dispatch(deleteTask(task)).unwrap();
  };

  return (
    <Accordion
      open={task.isNew ? true : expandAccordion}
      icon={
        <Popover
          placement="bottom-end"
          open={openMore}
          handler={handleOpenMore}
        >
          <PopoverHandler
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <Image src={ThreeDots} alt="img" width={20} />
          </PopoverHandler>
          <PopoverContent
            className="w-32 p-1 rounded-md border-primary-gray-100"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <p
              className="px-3 py-2 text-i-red hover:text-i-red rounded-md hover:bg-primary-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
              onClick={handleDeleteTask}
            >
              Delete
            </p>
          </PopoverContent>
        </Popover>
      }
      className="py-[22px]"
    >
      <AccordionHeader
        className="py-0 items-start text-sm font-semibold border-b-0 "
        onClick={handleExpandAccordion}
      >
        <div className="w-full flex gap-5 items-start">
          {/* Checkbox */}
          <Checkbox
            ripple={false}
            checked={task.completed}
            className="rounded-sm border-2 border-primary-gray-100 checked:bg-white checked:border-primary-gray-100"
            containerProps={{ className: 'p-0' }}
            iconProps={{ className: 'text-primary-gray-100' }}
            onClick={(event) => event.stopPropagation()}
            onChange={handleCheck}
          />
          {/* Task Title */}
          <div className={`${(editTitle || task.isNew) && 'w-full'} max-w-80`}>
            {editTitle || task.isNew ? (
              <div className="w-full border border-primary-gray-100 rounded-md">
                <Input
                  autoFocus
                  placeholder="Type Task Title"
                  value={task.title}
                  className="border-none"
                  labelProps={{
                    className: 'before:content-none after:content-none',
                  }}
                  onClick={(event) => event.stopPropagation()}
                  onChange={({ target }) => {
                    setTask({ ...task, title: target.value });
                  }}
                  onBlur={editTitle ? handleUpdateTitle : handleCreateTask}
                />
              </div>
            ) : (
              <p
                className={
                  task.completed ? 'line-through text-primary-gray-100' : ''
                }
                onClick={() => setEditTitle(true)}
              >
                {task.title}
              </p>
            )}
          </div>
          {/* Task Deadline Info */}
          <div className="ml-auto flex gap-3 items-start">
            <p className="font-normal text-i-red">
              {task.completed ? '' : countDaysLeft(task.deadline)}
            </p>
            <p className="font-normal">{task.deadline}</p>
            <Image
              src={ArrowDown}
              alt="img"
              width={20}
              className={`${
                expandAccordion ? 'rotate-180' : 'rotate-0'
              } duration-300 ease-in-out`}
            />
          </div>
        </div>
      </AccordionHeader>
      <AccordionBody className="pb-0">
        <div className="flex">
          <div className="ml-10 flex flex-col !flex-grow gap-y-3">
            {/* Task Deadline Date Picker */}
            <div className="flex gap-[18px] items-center">
              <Image
                src={task.deadline ? ScheduleActive : Schedule}
                alt="img"
                width={20}
              />
              <DatePicker taskId={task.id} value={task.deadline} />
            </div>
            {/* Task Description */}
            <div className="flex gap-[18px] items-start">
              <Image
                src={task.description ? EditActive : Edit}
                alt="img"
                width={20}
                className="!shrink-0"
                onClick={() => setEditDesc(true)}
              />
              {editDesc ? (
                <div className="w-full border border-primary-gray-100 rounded-md">
                  <Textarea
                    autoFocus={editDesc}
                    value={task.description}
                    className="border-none"
                    labelProps={{
                      className: 'before:content-none after:content-none',
                    }}
                    onChange={({ target }) =>
                      setTask({ ...task, description: target.value })
                    }
                    onBlur={task.isNew ? handleCreateTask : handleUpdateDesc}
                  />
                </div>
              ) : (
                <p onClick={() => setEditDesc(true)}>
                  {task.description || 'No Description'}
                </p>
              )}
            </div>
          </div>
          <div className="ml-4" />
        </div>
      </AccordionBody>
    </Accordion>
  );
}
