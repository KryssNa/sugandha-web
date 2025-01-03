// types/countdown.ts
export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface CountdownProps {
  targetDate: Date | string;
  onComplete?: () => void;
  className?: string;
  showLabels?: boolean;
  labelStyle?: "full" | "short" | "minimal";
}

// hooks/useCountdown.ts
import { useCallback, useEffect, useState } from "react";

export const useCountdown = (
  targetDate: Date | string,
  onComplete?: () => void
) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const calculateTimeLeft = useCallback((target: Date) => {
    const now = new Date().getTime();
    const timeLeft = target.getTime() - now;

    if (timeLeft <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
      days: Math.floor(timeLeft / (1000 * 60 * 60 * 24)),
      hours: Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((timeLeft % (1000 * 60)) / 1000),
    };
  }, []);

  useEffect(() => {
    const target =
      typeof targetDate === "string" ? new Date(targetDate) : targetDate;

    const updateCountdown = () => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);

      if (Object.values(newTimeLeft).every((value) => value === 0)) {
        onComplete?.();
        return true;
      }
      return false;
    };

    // Initial calculation
    const isComplete = updateCountdown();
    if (isComplete) return;

    // Set up interval
    const intervalId = setInterval(() => {
      const isComplete = updateCountdown();
      if (isComplete) {
        clearInterval(intervalId);
      }
    }, 1000);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [targetDate, calculateTimeLeft, onComplete]);

  return timeLeft;
};
