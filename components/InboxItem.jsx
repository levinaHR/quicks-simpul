'use client';

import Participants from '@/public/icon/participants.svg';
import Image from 'next/image';
import React from 'react';

export default function InboxItem({ index, chatGroup }) {
  const getParticipants = (chatGroup) => {
    return [...new Set(chatGroup.chatlog.map((chat) => chat.sender))];
  };
  const getNewestChat = (chatGroup) => {
    return chatGroup.chatlog[chatGroup.chatlog.length - 1];
  };

  return (
    <div className="flex gap-4 py-[22px]">
      {/* Icon */}
      <div className="w-[51px]">
        {getParticipants(chatGroup).length > 2 ? (
          <Image src={Participants} alt="img" width={51} />
        ) : (
          <div className="mx-auto flex w-[34px] h-[34px] rounded-full bg-primary">
            <p className="m-auto font-medium text-white">
              {getParticipants(chatGroup)
                .find((p) => p !== 'You')
                .charAt(0)}
            </p>
          </div>
        )}
      </div>

      {/* Detail */}
      <div className="flex flex-col">
        {/* Title & Date Time */}
        <div className="flex gap-4">
          <p className="font-semibold text-primary">{chatGroup.title}</p>
          <p>
            {`${getNewestChat(chatGroup).date} ${
              getNewestChat(chatGroup).time
            }`}
          </p>
        </div>
        {/* Last Sender & Content */}
        <p className="font-semibold">{getNewestChat(chatGroup).sender}:</p>
        <p>{getNewestChat(chatGroup).content}</p>
      </div>

      {/* Indicator */}
      <div
        className={`${
          index === 0 ? 'block' : 'hidden'
        } ml-auto mt-auto w-[10px] h-[10px] rounded-full bg-i-red`}
      />
    </div>
  );
}
