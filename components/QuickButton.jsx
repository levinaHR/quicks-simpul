'use client';

import QuickIcon from '@/public/icon/quick.svg';
import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

export default function QuickButton({
  expand,
  openedTab,
  handleExpand,
  handleCloseTab,
  children,
}) {
  return (
    <div className="fixed bottom-7 right-8 flex flex-row gap-6">
      {/* Button */}
      <div className="order-last">
        {/* Default State */}
        <Button
          size="lg"
          className={`${
            openedTab === null ? 'block' : 'hidden'
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
            openedTab === null ? 'hidden' : 'block'
          } relative w-16 h-16`}
        >
          <div
            style={{ backgroundColor: openedTab?.activeColor }}
            className="absolute z-10 w-full h-full rounded-full"
          >
            <Image
              src={openedTab?.activeIcon}
              layout="fill"
              objectFit="scale-down"
              alt="img"
            />
          </div>

          {/* Close Button */}
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
        {children}
      </div>
    </div>
  );
}
