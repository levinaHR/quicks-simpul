'use client';

import { updateTask } from '@/lib/slices/taskSlice';
import ArrowDown from '@/public/icon/arrow-down.svg';
import Calendar from '@/public/icon/calendar.svg';
import {
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { useDispatch } from 'react-redux';

export default function DatePicker({ taskId, value }) {
  const dispatch = useDispatch();

  const [date, setDate] = useState(null);

  useEffect(() => {
    if (value) {
      setDate(moment(value, 'DD/MM/YYYY').toDate());
    }
  }, [value]);

  const handleUpdateDate = async () => {
    await dispatch(
      updateTask({ id: taskId, deadline: moment(date).format('DD/MM/YYYY') })
    ).unwrap();
  };

  return (
    <Popover placement="bottom-start">
      <PopoverHandler>
        <div className="flex max-w-48 border border-primary-gray-100 rounded-md">
          <Input
            value={date ? moment(date).format('DD/MM/YYYY') : ''}
            className="border-none"
            labelProps={{
              className: 'before:content-none after:content-none',
            }}
            onChange={() => null}
          />
          <Image
            src={Calendar}
            alt="img"
            width={20}
            className="relative right-10"
          />
        </div>
      </PopoverHandler>
      <PopoverContent className='ml-40'>
        <DayPicker
          mode="single"
          selected={date}
          onSelect={setDate}
          onDayMouseLeave={handleUpdateDate}
          showOutsideDays
          className="border-0"
          classNames={{
            caption: 'flex justify-center py-2 mb-2 relative items-center',
            caption_label: 'text-sm font-bold text-gray-900',
            nav: 'flex items-center',
            nav_button:
              'h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300',
            nav_button_previous: 'absolute left-1.5',
            nav_button_next: 'absolute right-1.5',
            table: 'w-full border-collapse',
            head_row: 'flex font-medium text-gray-900',
            head_cell: 'm-0.5 w-7 font-bold text-sm',
            row: 'flex w-full mt-0',
            cell: 'text-gray-600 rounded-md h-7 w-7 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'h-7 w-7 p-0 font-normal',
            day_range_end: 'day-range-end',
            day_selected:
              'rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white',
            day_today: 'rounded-md bg-gray-200 text-gray-900',
            day_outside:
              'day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10',
            day_disabled: 'text-gray-500 opacity-50',
            day_hidden: 'invisible',
          }}
          components={{
            IconLeft: ({ ...props }) => (
              <Image
                {...props}
                src={ArrowDown}
                alt="img"
                width={20}
                className="rotate-90"
              />
            ),
            IconRight: ({ ...props }) => (
              <Image
                {...props}
                src={ArrowDown}
                alt="img"
                width={20}
                className="-rotate-90"
              />
            ),
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
