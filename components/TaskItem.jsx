'use client';

import { createTask, deleteTask, updateTask } from '@/lib/slices/taskSlice';
import ArrowDown from '@/public/icon/arrow-down.svg';
import EditActive from '@/public/icon/edit-active.svg';
import Edit from '@/public/icon/edit.svg';
import ScheduleActive from '@/public/icon/schedule-active.svg';
import Schedule from '@/public/icon/schedule.svg';
import StickerActive from '@/public/icon/sticker-active.svg';
import Sticker from '@/public/icon/sticker.svg';
import ThreeDots from '@/public/icon/three-dots.svg';
import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  Checkbox,
  Chip,
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

const stickerOptions = [
  {
    label: 'Important ASAP',
    color: 'bg-[#E5F1FF]',
    peer: 'peer/s1',
    peerChecked: 'peer-checked/s1:ring-primary',
  },
  {
    label: 'Offline Meeting',
    color: 'bg-[#FDCFA4]',
    peer: 'peer/s2',
    peerChecked: 'peer-checked/s2:ring-primary',
  },
  {
    label: 'Virtual Meeting',
    color: 'bg-[#F9E9C3]',
    peer: 'peer/s3',
    peerChecked: 'peer-checked/s3:ring-primary',
  },
  {
    label: 'ASAP',
    color: 'bg-[#AFEBDB]',
    peer: 'peer/s4',
    peerChecked: 'peer-checked/s4:ring-primary',
  },
  {
    label: 'Client Related',
    color: 'bg-[#CBF1C2]',
    peer: 'peer/s5',
    peerChecked: 'peer-checked/s5:ring-primary',
  },
  {
    label: 'Self Task',
    color: 'bg-[#CFCEF9]',
    peer: 'peer/s6',
    peerChecked: 'peer-checked/s6:ring-primary',
  },
  {
    label: 'Appointments',
    color: 'bg-[#F9E0FD]',
    peer: 'peer/s7',
    peerChecked: 'peer-checked/s7:ring-primary',
  },
  {
    label: 'Court Related',
    color: 'bg-[#9DD0ED]',
    peer: 'peer/s8',
    peerChecked: 'peer-checked/s8:ring-primary',
  },
];

function StickerOptions({ stickers, onCheck }) {
  return (
    <div class="flex flex-col gap-3.5">
      {stickerOptions.map((option, i) => (
        <>
          <input
            id={i}
            type="checkbox"
            checked={stickers.includes(option.label)}
            className={`${option.peer} hidden`}
            onChange={() => onCheck(option.label)}
          />
          <label
            for={i}
            className={`${option.peerChecked} ${option.color} px-3.5 py-2 select-none cursor-pointer rounded-lg text-primary-gray-200
            ring-1 ring-inset ring-transparent hover:bg-opacity-70 transition-all duration-200 ease-in-out`}
          >
            {option.label}
          </label>
        </>
      ))}
    </div>
  );
}

export default function TaskItem({ item }) {
  const dispatch = useDispatch();

  const [task, setTask] = useState({});
  const [stickers, setStickers] = useState([]);
  const [expandAccordion, setExpandAccordion] = useState(false);
  const [openMore, setOpenMore] = useState(false);
  const [editTitle, setEditTitle] = useState(false);
  const [editDesc, setEditDesc] = useState(false);

  useEffect(() => {
    setTask(item);
    setStickers(item.stickers);
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
    if (!task.isNew) {
      setOpenMore(!openMore);
    }
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

  // Sticker Functions
  const handleStickerCheck = (sticker) => {
    let temp = [...stickers];

    if (!temp.includes(sticker)) {
      temp.push(sticker);
    } else {
      temp.splice(temp.indexOf(sticker), 1);
    }
    setStickers(temp);
  };
  const handleUpdateStickers = async () => {
    setTask({ ...task, stickers: stickers });
    await dispatch(updateTask({ id: task.id, stickers: stickers })).unwrap();
  };

  return (
    <Accordion
      open={task.isNew ? true : expandAccordion}
      icon={
        // More Action
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
            className="w-32 p-0 rounded-md border-[#BDBDBD] overflow-hidden"
            onClick={(event) => {
              event.stopPropagation();
            }}
          >
            <p
              className="px-3 py-2 text-i-red hover:bg-primary-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
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
              <Input
                autoFocus
                placeholder="Type Task Title"
                value={task.title}
                className="!border !border-primary-gray-100 bg-white placeholder:opacity-100"
                labelProps={{
                  className: 'hidden',
                }}
                onClick={(event) => event.stopPropagation()}
                onChange={({ target }) => {
                  setTask({ ...task, title: target.value });
                }}
                onBlur={editTitle ? handleUpdateTitle : handleCreateTask}
              />
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
          {/* Task Sticker */}
          <div className="flex my-2 mr-2 gap-[18px] items-center rounded-sm ring-8 ring-[#F9F9F9] bg-[#F9F9F9]">
            <Popover placement="bottom-start">
              <PopoverHandler>
                <Image
                  src={stickers.length === 0 ? Sticker : StickerActive}
                  alt="img"
                  width={20}
                />
              </PopoverHandler>
              <PopoverContent
                onBlur={handleUpdateStickers}
                className="w-full max-w-72 min-w-48 p-3.5 rounded-md border-[#BDBDBD] overflow-hidden"
              >
                <StickerOptions
                  stickers={stickers}
                  onCheck={handleStickerCheck}
                />
              </PopoverContent>
            </Popover>

            <div className="flex gap-[10px]">
              {stickers.map((sticker, i) => (
                <>
                  <Chip
                    key={i}
                    value={sticker}
                    className={`${
                      stickerOptions.findIndex(
                        (option) => option.label === sticker
                      ) !== -1
                        ? stickerOptions.find(
                            (option) => option.label === sticker
                          ).color
                        : ''
                    } normal-case rounded-md text-primary-gray-200`}
                  />
                </>
              ))}
            </div>
          </div>
        </div>
      </AccordionBody>
    </Accordion>
  );
}
