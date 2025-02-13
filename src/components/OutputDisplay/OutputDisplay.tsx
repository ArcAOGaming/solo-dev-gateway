import React, { useState, useEffect } from 'react';
import './OutputDisplay.css';

interface OutputDisplayProps {
  content: string;
  typing?: boolean;
}

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content, typing = true }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!typing) {
      setDisplayedContent(content);
      return;
    }

    setIsTyping(true);
    let currentIndex = 0;
    const contentLength = content.length;

    const typingInterval = setInterval(() => {
      if (currentIndex < contentLength) {
        setDisplayedContent(prev => prev + content[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 50); // Adjust speed as needed

    return () => clearInterval(typingInterval);
  }, [content, typing]);

  return (
    <div className="output-display">
      <div className="output-content">
        {displayedContent}
        {isTyping && <span className="typewriter-cursor" />}
      </div>
    </div>
  );
};
