import { useState, useEffect, useCallback } from 'react';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSecs).padStart(
    2,
    '0'
  )}`;
};

type TimerState = 'idle' | 'running' | 'paused' | 'finished';

interface UseTimerProps {
  timeLimitInSeconds: number;
}

export const useTimer = ({ timeLimitInSeconds }: UseTimerProps) => {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    if (timerState === 'running') {
      intervalId = setInterval(() => {
        setElapsedSeconds((prev) => {
          const newElapsed = prev + 1;
          if (newElapsed >= timeLimitInSeconds) {
            setTimerState('finished');
            return timeLimitInSeconds;
          }
          return newElapsed;
        });
      }, 1000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [timerState, timeLimitInSeconds]);

  const start = useCallback(() => setTimerState('running'), []);
  const pause = useCallback(() => setTimerState('paused'), []);
  const resume = useCallback(() => setTimerState('running'), []);
  const reset = useCallback(() => {
    setTimerState('idle');
    setElapsedSeconds(0);
  }, []);

  const remainingSeconds = timeLimitInSeconds - elapsedSeconds;
  const formattedTime = formatTime(remainingSeconds);

  return {
    timerState,
    elapsedSeconds,
    remainingSeconds,
    formattedTime,
    start,
    pause,
    resume,
    reset,
  };
};
