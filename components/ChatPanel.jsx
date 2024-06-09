'use client';

import {
  getOpenedChat,
  insertNewMessage,
  removeMessage,
  updateChatlog,
} from '@/lib/slices/inboxSlice';
import ArrowBack from '@/public/icon/arrow-back.svg';
import Close from '@/public/icon/close.svg';
import ThreeDots from '@/public/icon/three-dots.svg';
import {
  Alert,
  Button,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
  Spinner,
} from '@material-tailwind/react';
import moment from 'moment';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function ChatBubble({ participants, chat, onDelete }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  const handleDelete = () => {
    if (chat.sender === 'You') {
      onDelete();
      setOpen(false);
    }
  };

  return (
    <div
      className={`${chat.sender === 'You' && 'items-end'} flex flex-col gap-1`}
    >
      {/* Sender */}
      <p
        className={`${
          chat.sender === 'You'
            ? 'text-ci-purple'
            : participants.length <= 2
            ? 'text-primary'
            : participants.filter((p) => p !== 'You').indexOf(chat.sender) %
                2 ===
              0
            ? 'text-ci-yellow' // yellow if sender in even position
            : 'text-ci-green'
        } font-semibold`}
      >
        {chat.sender}
      </p>

      {/* Message Bubble */}
      <div className="flex gap-x-[5px] items-start">
        {/* More Action */}
        <Popover open={open} handler={handleOpen} placement="bottom-start">
          <PopoverHandler>
            <Image
              src={ThreeDots}
              alt="img"
              width={16}
              className={chat.sender !== 'You' && 'order-last'}
            />
          </PopoverHandler>
          <PopoverContent className="w-32 p-0 rounded-md border-[#BDBDBD] overflow-hidden">
            {chat.sender === 'You' && (
              <>
                <p className="px-3 py-2 text-primary hover:bg-primary-gray-50 cursor-pointer transition-colors duration-150 ease-in-out">
                  Edit
                </p>
                <hr className="border-[#BDBDBD]" />
              </>
            )}
            <p
              className="px-3 py-2 text-i-red hover:bg-primary-gray-50 cursor-pointer transition-colors duration-150 ease-in-out"
              onClick={handleDelete}
            >
              Delete
            </p>
          </PopoverContent>
        </Popover>

        {/* Bubble */}
        <div
          className={`${
            chat.sender === 'You'
              ? 'bg-c-purple'
              : participants.length <= 2
              ? 'bg-[#F8F8F8]'
              : participants.filter((p) => p !== 'You').indexOf(chat.sender) %
                  2 ===
                0
              ? 'bg-c-yellow'
              : 'bg-c-green'
          } p-[10px] max-w-lg text-[#4f4f4f] rounded-md`}
        >
          <p className="break-words">{chat.content}</p>
          <p className="mt-1.5">{chat.time}</p>
        </div>
      </div>
    </div>
  );
}

export default function ChatPanel({ onClose }) {
  const dispatch = useDispatch();

  const openedChat = useSelector(getOpenedChat);

  const newChatIndicatorRef = useRef(null);
  const [isIndicatorVisible, setIsIndicatorVisible] = useState(false);
  const [hasNewChatIndicator, setHasNewChatIndicator] = useState(false);
  const [inputMsg, setInputMsg] = useState('');

  const getParticipants = (chatGroup) => {
    return [...new Set(chatGroup.chatlog.map((chat) => chat.sender))];
  };

  const groupChatByDate = (chatGroup) => {
    // result [['date', [{chat}, {chat}]], ['date', [{chat}, {chat}]]]
    return Object.entries(
      Object.groupBy(chatGroup.chatlog, ({ date }) => date)
    );
  };

  const getNewestChat = (chatGroup) => {
    return chatGroup.chatlog[chatGroup.chatlog.length - 1];
  };

  const isElementVisibleInContainer = (ele, container) => {
    // from https://phuoc.ng/collection/intersection-observer-with-react/check-if-an-element-is-visible-in-the-viewport/
    const rect = ele.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    return (
      rect.top >= containerRect.top &&
      rect.left >= containerRect.left &&
      rect.bottom <= containerRect.bottom &&
      rect.right <= containerRect.right
    );
  };

  const handleScroll = () => {
    // from https://phuoc.ng/collection/intersection-observer-with-react/check-if-an-element-is-visible-in-the-viewport/
    const rootEle = document.querySelector('#chat-container');
    const indicator = newChatIndicatorRef.current;
    if (!rootEle || !indicator) {
      return;
    }
    setIsIndicatorVisible(isElementVisibleInContainer(indicator, rootEle));
  };

  const handleSend = () => {
    if (inputMsg !== '') {
      const message = {
        sender: 'You',
        date: moment().format('DD/MM/YYYY'),
        time: moment().format('HH:mm'),
        content: inputMsg,
      };

      dispatch(insertNewMessage(message));
      dispatch(
        updateChatlog({
          id: openedChat.id,
          chatlog: [...openedChat.chatlog, message],
        })
      );
      setInputMsg('');
    }
  };

  const handleDelete = (message) => {
    dispatch(removeMessage(message));
    dispatch(
      updateChatlog({
        id: openedChat.id,
        chatlog: openedChat.chatlog.filter((chat) => chat !== message),
      })
    );
  };

  useEffect(() => {
    // check if chat window has new chat indicator
    if (newChatIndicatorRef.current) {
      setHasNewChatIndicator(true);
    } else {
      setHasNewChatIndicator(false);
    }
  }, [openedChat]);

  return (
    openedChat && (
      <>
        {/* Header */}
        <div className="flex gap-4 items-center">
          <Image src={ArrowBack} alt="img" width={24} onClick={onClose} />
          <div>
            <p className="text-base font-semibold text-primary">
              {openedChat.title}
            </p>
            <p
              className={
                getParticipants(openedChat).length > 2 ? 'block' : 'hidden'
              }
            >
              {getParticipants(openedChat).length} Participants
            </p>
          </div>
          <Image
            src={Close}
            alt="img"
            width={14}
            className="ml-auto"
            onClick={onClose}
          />
        </div>
        <hr className="-ml-8 mt-[18px] w-[111%] border-[#BDBDBD]" />

        {/* Chat Log */}
        <div
          id="chat-container"
          className="py-3 h-full overflow-y-auto"
          onScroll={handleScroll}
        >
          {groupChatByDate(openedChat).map((arr, i) => (
            <>
              {/* Date Divider */}
              <div
                name={arr[0]}
                className="mt-10 mb-2 flex items-center first:hidden first:mt-5"
              >
                <hr className="flex-grow border-t border-[#4f4f4f]" />
                <span className="px-3 font-semibold text-[#4f4f4f]">
                  {moment().format('MMMM DD, YYYY') ===
                  moment(arr[0], 'DD/MM/YYYY').format('MMMM DD, YYYY')
                    ? `Today ${moment(arr[0], 'DD/MM/YYYY').format(
                        'MMMM DD, YYYY'
                      )}`
                    : moment(arr[0], 'DD/MM/YYYY').format('MMMM DD, YYYY')}
                </span>
                <hr className="flex-grow border-t border-[#4f4f4f]" />
              </div>

              {/* Chat Bubbles */}
              <div className="space-y-[10px]">
                {arr[1].map((chat, j) => (
                  <>
                    {/* New Chat Indicator */}
                    {getNewestChat(openedChat) === chat &&
                      chat.sender !== 'You' && (
                        <div
                          id="new-chat-indicator"
                          ref={newChatIndicatorRef}
                          className="my-7 flex items-center"
                        >
                          <hr className="flex-grow border-t border-i-red" />
                          <span className="px-3 font-semibold text-i-red">
                            New Message
                          </span>
                          <hr className="flex-grow border-t border-i-red" />
                        </div>
                      )}

                    <ChatBubble
                      key={j}
                      participants={getParticipants(openedChat)}
                      chat={chat}
                      onDelete={() => handleDelete(chat)}
                    />
                  </>
                ))}
              </div>
            </>
          ))}

          {/* Floating New Chat Indicator */}
          {hasNewChatIndicator && (
            <div
              className={` ${
                isIndicatorVisible ? 'hidden' : ''
              } sticky -bottom-2 flex justify-center`}
            >
              <div className="flex gap-1 px-3 py-2 items-center rounded-md font-semibold text-primary bg-[#E9F3FF]">
                <p>New Message</p>
                <div className="-rotate-90">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"
                      fill="#2F80ED"
                    />
                  </svg>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div>
          <Alert
            icon={<Spinner color="blue" className="text-white" />}
            className={`${
              getParticipants(openedChat).length > 2 ? 'hidden' : 'block'
            } peer p-[10px] font-semibold text-[#4F4F4F] bg-[#E9F3FF]`}
          >
            Please wait while we connect you with one of our team ...
          </Alert>
          <div className="mt-6 peer-[.block]:!mt-[10px] flex gap-3">
            <Input
              value={inputMsg}
              onChange={({ target }) => setInputMsg(target.value)}
              placeholder="Type a new message"
              className="!border !border-primary-gray-100 rounded-md bg-white placeholder-primary-gray-100 placeholder:opacity-100"
              labelProps={{
                className: 'hidden',
              }}
              onKeyDown={({ key }) => {
                if (key === 'Enter') handleSend();
              }}
            />
            <Button className="px-5 rounded-md bg-primary" onClick={handleSend}>
              Send
            </Button>
          </div>
        </div>
      </>
    )
  );
}
