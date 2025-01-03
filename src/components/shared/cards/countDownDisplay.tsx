// components/CountdownDisplay.tsx
import { CountdownProps, useCountdown } from "@/hooks/useCountdown";
import React from "react";
import { TimeUnit } from "../timeUnit";

export const CountdownDisplay: React.FC<CountdownProps> = ({
  targetDate,
  onComplete,
  className = "",
  showLabels = true,
  labelStyle = "short",
}) => {
  const timeLeft = useCountdown(targetDate, onComplete);

  return (
    <div className={`flex gap-2 md:gap-6 justify-center ${className}`}>
      <TimeUnit
        value={timeLeft.days}
        label='days'
        showLabel={showLabels}
        labelStyle={labelStyle}
      />
      <TimeUnit
        value={timeLeft.hours}
        label='hours'
        showLabel={showLabels}
        labelStyle={labelStyle}
      />
      <TimeUnit
        value={timeLeft.minutes}
        label='minutes'
        showLabel={showLabels}
        labelStyle={labelStyle}
      />
      <TimeUnit
        value={timeLeft.seconds}
        label='seconds'
        showLabel={showLabels}
        labelStyle={labelStyle}
      />
    </div>
  );
};
