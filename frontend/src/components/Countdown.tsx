import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { getSecondsToKolkataMidnight, formatSecondsToHHMMSS } from '../lib/date.js';

interface CountdownProps {
  onRollover?: () => void;
}

export function Countdown({ onRollover }: CountdownProps) {
  const [seconds, setSeconds] = useState(getSecondsToKolkataMidnight());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getSecondsToKolkataMidnight();
      setSeconds(remaining);
      if (remaining <= 1 && onRollover) {
        onRollover();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [onRollover]);

  return (
    <div className="countdown" aria-live="off">
      <div className="countdown-header">
        <Clock className="countdown-icon" size={14} aria-hidden="true" />
        <span className="countdown-label">Next puzzle in</span>
      </div>
      <time className="countdown-time" dateTime={`PT${seconds}S`}>
        {formatSecondsToHHMMSS(seconds)}
      </time>
    </div>
  );
}
