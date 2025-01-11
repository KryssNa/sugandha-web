import React, { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: Date;
}

const getTimeRemaining = (targetDate: Date) => {
  const total = Date.parse(targetDate.toString()) - Date.parse(new Date().toString());
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
};

export const CountdownTimer: React.FC<CountdownProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining(targetDate));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeRemaining = getTimeRemaining(targetDate);
      setTimeRemaining(newTimeRemaining);

      if (newTimeRemaining.total <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  // Hide the countdown if the target date is in the past
  if (timeRemaining.total <= 0) {
    return null;
  }

  return (
    <div className="flex space-x-2">
      <div className="grow shrink basis-0 self-stretch pl-[9.88px] pr-[8.48px] pt-[3.50px] pb-[5.50px] bg-[#121535] rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
        <div className="w-[45.64px] h-8 text-[#fa6800] text-center text-2xl font-medium font-['Inter'] leading-9">
          {timeRemaining.days}
        </div>
        <div className="w-[33.74px] h-[17px] text-white text-sm font-medium font-['Inter'] leading-[21px]">
          Days
        </div>
      </div>
      <div className="grow shrink basis-0 self-stretch pl-[15.64px] pr-[15.24px] pt-[3.50px] pb-[5.50px] bg-[#121535] rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
        <div className="w-[27.13px] h-8 text-[#fa6800] text-2xl font-medium font-['Inter'] leading-9 text-center">
          {timeRemaining.hours}
        </div>
        <div className="w-[33.12px] h-[17px] text-white text-sm font-medium font-['Inter'] leading-[21px]">
          Hour
        </div>
      </div>
      <div className="grow shrink basis-0 self-stretch pl-[17.50px] pr-[16.27px] pt-[3.50px] pb-[5.50px] bg-[#121535] rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
        <div className="w-[30.23px] h-8 text-[#fa6800] text-2xl font-medium font-['Inter'] leading-9 text-center">
          {timeRemaining.minutes}
        </div>
        <div className="w-[25.08px] h-[17px] text-white text-sm font-medium font-['Inter'] leading-[21px]">
          Min
        </div>
      </div>
      <div className="grow shrink basis-0 self-stretch pl-[16.97px] pr-[15.89px] pt-[3.50px] pb-[5.50px] bg-[#121535] rounded-lg flex-col justify-center items-center gap-1.5 inline-flex">
        <div className="w-[31.14px] h-8 text-[#fa6800] text-2xl font-medium font-['Inter'] leading-9 text-center">
          {timeRemaining.seconds}
        </div>
        <div className="w-[25.71px] h-[17px] text-white text-sm font-medium font-['Inter'] leading-[21px]">
          Sec
        </div>
      </div>
    </div>
  );
};
