import React from "react";

interface TimeUnitProps {
  value: number;
  label: string;
  showLabel?: boolean;
  labelStyle?: "full" | "short" | "minimal";
}

const timeLabels = {
  full: {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
  },
  short: { days: "Days", hours: "Hrs", minutes: "Min", seconds: "Sec" },
  minimal: { days: "D", hours: "H", minutes: "M", seconds: "S" },
};

export const TimeUnit: React.FC<TimeUnitProps> = ({
  value,
  label,
  showLabel = true,
  labelStyle = "short",
}) => (
  <div className='flex flex-col items-center'>
    <div className='w-20 h-20 bg-orange-600 rounded-2xl flex items-center justify-center'>
      <span className='text-2xl font-semibold text-white'>
        {value.toString().padStart(2, "0")}
      </span>
    </div>
    {showLabel && (
      <span className='mt-2 text-yellow-700 text-xl font-medium uppercase'>
        {timeLabels[labelStyle][label as keyof typeof timeLabels.full]}
      </span>
    )}
  </div>
);
