import { Button } from '@material-tailwind/react';
import Image from 'next/image';
import React from 'react';

export default function QuickItem({
  title,
  icon,
  hideTitle,
  hideItem,
  onClick,
}) {
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
