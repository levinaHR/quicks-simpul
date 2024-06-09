'use client';

import InboxTab from '@/components/InboxTab';
import QuickButton from '@/components/QuickButton';
import QuickItem from '@/components/QuickItem';
import TaskTab from '@/components/TaskTab';
import InboxWhiteIcon from '@/public/icon/inbox-white.svg';
import InboxIcon from '@/public/icon/inbox.svg';
import TaskWhiteIcon from '@/public/icon/task-white.svg';
import TaskIcon from '@/public/icon/task.svg';
import { Card, CardBody, Collapse } from '@material-tailwind/react';
import { useState } from 'react';

const tabs = [
  {
    title: 'Task',
    icon: TaskIcon,
    activeIcon: TaskWhiteIcon,
    activeColor: '#F8B76B',
    content: <TaskTab />,
  },
  {
    title: 'Inbox',
    icon: InboxIcon,
    activeIcon: InboxWhiteIcon,
    activeColor: '#8785FF',
    content: <InboxTab />,
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
      <div className="fixed w-full bottom-24 right-8">
        <Collapse open={openedTab !== null}>
          <Card className="my-4 ml-auto max-w-2xl min-h-[720px] rounded-md border border-primary-gray-100">
            <CardBody className="p-0 px-8 py-6 flex flex-col !flex-grow">
              {openedTab?.content}
            </CardBody>
          </Card>
        </Collapse>
      </div>

      <div className="fixed bottom-7 right-8 ">
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
