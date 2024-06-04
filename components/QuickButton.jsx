'use client';

import MsgWhiteIcon from '@/public/icon/msg-white.svg';
import MsgIcon from '@/public/icon/msg.svg';
import QuickIcon from '@/public/icon/quick.svg';
import TodoWhiteIcon from '@/public/icon/todo-white.svg';
import TodoIcon from '@/public/icon/todo.svg';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import React, { useState } from 'react';

function QuickItem({ title, icon, hideTitle, hideItem, onClick }) {
  return (
    <div className={`${hideItem ? 'hidden' : 'block'} relative`}>
      <div
        className={`${
          hideTitle ? 'hidden' : 'block'
        } absolute -top-8 w-full text-center`}
      >
        <p className="text-primary-white">{title}</p>
      </div>

      <Button
        size="lg"
        className="w-14 h-14 p-4 rounded-full bg-primary-white"
        onClick={onClick}
      >
        <Image src={icon} layout="fill" objectFit="scale-down" alt="img" />
      </Button>
    </div>
  );
}

export default function QuickButton() {
  const [expand, setExpand] = useState(false);
  const [currentTab, setCurrentTab] = useState(null);

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleCloseTab = () => {
    setCurrentTab(null);
    setExpand(false);
  };

  return (
    <div className="fixed bottom-7 right-8 flex flex-row gap-6">
      {/* Button */}
      <div className="order-last">
        {/* Default State */}
        <Button
          size="lg"
          className={`${
            currentTab === null ? 'block' : 'hidden'
          } relative w-16 h-16 z-10 rounded-full bg-primary`}
          onClick={handleExpand}
        >
          <Image
            src={QuickIcon}
            layout="fill"
            objectFit="scale-down"
            alt="img"
          />
        </Button>
        {/* Opened Tab State */}
        <div
          className={`${
            currentTab === null ? 'hidden' : 'block'
          } relative w-16 h-16`}
        >
          {currentTab === 'msg' && (
            <div className="absolute z-10 w-full h-full rounded-full bg-i-purple">
              <Image
                src={MsgWhiteIcon}
                layout="fill"
                objectFit="scale-down"
                alt="img"
              />
            </div>
          )}
          {currentTab === 'todo' && (
            <div className="absolute z-10 w-full h-full rounded-full bg-i-orange">
              <Image
                src={TodoWhiteIcon}
                layout="fill"
                objectFit="scale-down"
                alt="img"
              />
            </div>
          )}

          <Button
            className="absolute right-3 w-full h-full rounded-full bg-primary-gray-200"
            onClick={handleCloseTab}
          />
        </div>
      </div>

      {/* Menu Items */}
      <div
        className={`${
          expand ? '!visible !opacity-100 !translate-x-0' : ''
        } collapse flex flex-row items-center gap-6 opacity-0 translate-x-20 transition-all duration-300`}
      >
        <QuickItem
          title="Task"
          icon={TodoIcon}
          hideTitle={currentTab !== null}
          hideItem={currentTab === 'todo'}
          onClick={() => setCurrentTab('todo')}
        />
        <QuickItem
          title="Inbox"
          icon={MsgIcon}
          hideTitle={currentTab !== null}
          hideItem={currentTab === 'msg'}
          onClick={() => setCurrentTab('msg')}
        />
      </div>
    </div>
  );
}
