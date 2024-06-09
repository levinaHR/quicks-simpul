'use client';

import {
  closeChat,
  fetchAllChatGroup,
  getAllChatGroup,
  getChatGroupError,
  getChatGroupStatus,
  getOpenedChat,
  openChat,
} from '@/lib/slices/inboxSlice';
import Search from '@/public/icon/search.svg';
import { Input, ListItem, Spinner } from '@material-tailwind/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChatPanel from './ChatPanel';
import InboxItem from './InboxItem';

export default function InboxTab() {
  const dispatch = useDispatch();

  const inbox = useSelector(getAllChatGroup);
  const openedChat = useSelector(getOpenedChat);
  const inboxStatus = useSelector(getChatGroupStatus);
  const inboxError = useSelector(getChatGroupError);

  useEffect(() => {
    if (inboxStatus === 'idle') {
      dispatch(fetchAllChatGroup());
    }
  }, [dispatch, inboxStatus]);

  const handleOpenChat = (chatGroup) => {
    dispatch(openChat(chatGroup));
  };

  const handleCloseChat = () => {
    dispatch(closeChat());
  };

  return (
    <div className="relative flex flex-col !flex-grow">
      {/* Inbox Tab */}
      <div className="absolute flex flex-col !flex-grow w-full h-full">
        {/* Search */}
        <div className="flex px-[86px] justify-between rounded-md border border-primary-gray-100">
          <Input
            placeholder="Search"
            className="!p-0 !border-0 bg-white placeholder-primary-gray-100 placeholder:opacity-100"
            labelProps={{
              className: 'hidden',
            }}
          />
          <Image src={Search} alt="img" width={12} />
        </div>

        {/* Chat Group List */}
        {(inboxStatus === 'idle' || inboxStatus === 'loading') && (
          <div className="flex flex-col gap-3 items-center my-auto">
            <Spinner color="blue-gray" className="h-12 w-12" />
            <p className="font-semibold">Loading Chats...</p>
          </div>
        )}
        {inboxStatus === 'failed' && (
          <div className="flex flex-col gap-3 items-center my-auto">
            <p className="!text-4xl font-semibold text-i-red">!</p>
            <p className="font-semibold text-i-red">An error occured</p>
          </div>
        )}
        {inboxStatus === 'succeeded' && (
          <div className="divide-y divide-primary-gray-100">
            {inbox.map((chatGroup, i) => (
              <ListItem
                key={i}
                className="block p-0 rounded-none"
                onClick={() => handleOpenChat(chatGroup)}
              >
                <InboxItem index={i} chatGroup={chatGroup} />
              </ListItem>
            ))}
          </div>
        )}
      </div>

      {/* Chat Panel */}
      <div
        className={`${
          openedChat ? '!visible !opacity-100 !translate-x-0' : ''
        } collapse absolute z-10 flex flex-col w-full h-full bg-white translate-x-[110%] transition-all duration-300`}
      >
        <ChatPanel onClose={handleCloseChat} />
      </div>
    </div>
  );
}
