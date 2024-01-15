import { useEffect, useState } from "react";
import { formatTimeSpan } from "../utils/time";

interface TimerProps {
  startTime: Date | null;
}

/**
 * Displays the elapsed since the puzzle started.
 */
export default function Timer({ startTime }: TimerProps) {
  /** The current time, updated every interval. */
  const [currentTime, setCurrentTime] = useState<number>(0);

  /** Elapsed time since starting in milliseconds. */
  const elapsedTime = startTime
    ? Math.max(currentTime - startTime.getTime(), 0)
    : 0;

  const elapsedTimeStr = formatTimeSpan(elapsedTime);

  const updateInterval = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, updateInterval);

    return () => {
      clearInterval(interval);
    };
  }, [elapsedTime]);

  return (
    <div className="text-2xl" hidden={startTime == null}>
      {elapsedTimeStr}
    </div>
  );
}
