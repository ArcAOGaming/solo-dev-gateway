import React, { useState, useEffect } from 'react';
import './StoneTablet.css';

interface StoneTabletProps {
  questTitle?: string;
  questDescription?: string;
  totalQuests?: number;
  completedQuests?: number;
  timeLimit?: number; // in seconds
}

export const StoneTablet: React.FC<StoneTabletProps> = ({
  questTitle = "NOTIFICATION",
  questDescription = "A job-change quest can now be ordered.",
  totalQuests = 4,
  completedQuests = 1,
  timeLimit = 14400 // 4 hours in seconds
}) => {
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [loadingPosition, setLoadingPosition] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    const loadingTimer = setInterval(() => {
      setLoadingPosition((prev) => (prev + 1) % 30);
    }, 100);

    return () => {
      clearInterval(timer);
      clearInterval(loadingTimer);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="stone-tablet-container">
      <div className="crack crack-1" />
      <div className="crack crack-2" />
      <div className="crack crack-3" />
      <div className="moss moss-1" />
      <div className="moss moss-2" />
      <div className="moss moss-3" />
      <div className="stone-tablet-header">
        <div className="exclamation-mark" />
        <div className="quest-text" data-text={questTitle}>{questTitle}</div>
      </div>
      <div className="stone-tablet-content">
        {questDescription}
      </div>
      <div className="quest-progress">
        <div className="time-text">{formatTime(timeLeft)}/4h</div>
        <div className="loading-circle">
          {[...Array(30)].map((_, i) => (
            <div 
              key={i} 
              className={`circle-segment ${
                Math.abs(loadingPosition - i) <= 2 || 
                Math.abs(loadingPosition - i) >= 28 ? 
                'active' : ''
              }`}
              style={{ 
                transform: `rotate(${i * 12}deg)`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
