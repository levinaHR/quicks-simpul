'use client';

import QuickButton from '@/components/QuickButton';
import QuickItem from '@/components/QuickItem';
import MsgWhiteIcon from '@/public/icon/msg-white.svg';
import MsgIcon from '@/public/icon/msg.svg';
import TodoWhiteIcon from '@/public/icon/todo-white.svg';
import TodoIcon from '@/public/icon/todo.svg';
import { Card, CardBody, Collapse } from '@material-tailwind/react';
import { useState } from 'react';

const tabs = [
  {
    title: 'Task',
    icon: TodoIcon,
    activeIcon: TodoWhiteIcon,
    activeColor: '#F8B76B',
  },
  {
    title: 'Inbox',
    icon: MsgIcon,
    activeIcon: MsgWhiteIcon,
    activeColor: '#8785FF',
  },
];

export default function Home() {
  const [expand, setExpand] = useState(false);
  const [openedTab, setOpenedTab] = useState(null);

  const handleExpand = () => {
    setExpand(!expand);
  };

  const handleCloseTab = () => {
    setOpenedTab(null);
    setExpand(false);
  };

  return (
    <main className="p-24 min-h-screen flex flex-col items-center justify-between">
      <div>
        <QuickButton
          expand={expand}
          openedTab={openedTab}
          handleExpand={handleExpand}
          handleCloseTab={handleCloseTab}
        >
          {tabs.map((tab, i) => (
            <QuickItem
              key={i}
              title={tab.title}
              icon={tab.icon}
              hideTitle={openedTab !== null}
              hideItem={openedTab?.title === tab.title}
              onClick={() => setOpenedTab(tab)}
            />
          ))}
        </QuickButton>
      </div>
    </main>
  );
}
