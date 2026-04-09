'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TypingEffectProps {
  texts: string[];           // Array of strings to type in sequence
  typingSpeed?: number;      // ms per character (default: 60)
  deletingSpeed?: number;    // ms per character when deleting (default: 30)
  pauseDuration?: number;    // ms to pause after full text (default: 2000)
  className?: string;
  cursorClassName?: string;
  loop?: boolean;            // Whether to loop through texts (default: true)
}

export function TypingEffect({
  texts,
  typingSpeed = 60,
  deletingSpeed = 30,
  pauseDuration = 2000,
  className = '',
  cursorClassName = '',
  loop = true,
}: TypingEffectProps) {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isPaused) {
      const timer = setTimeout(() => {
        setIsPaused(false);
        if (texts.length > 1) {
          setIsDeleting(true);
        }
      }, pauseDuration);
      return () => clearTimeout(timer);
    }

    if (isDeleting) {
      if (displayText.length === 0) {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
        return;
      }
      const timer = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, deletingSpeed);
      return () => clearTimeout(timer);
    }

    if (displayText.length < currentText.length) {
      const timer = setTimeout(() => {
        setDisplayText(currentText.slice(0, displayText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timer);
    }

    // Full text typed — pause then maybe delete
    if (loop || textIndex < texts.length - 1) {
      setIsPaused(true);
    }
  }, [displayText, isDeleting, isPaused, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        className={`inline-block w-[2px] h-[1em] bg-[#00E87A] ml-1 align-middle ${cursorClassName}`}
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.7, repeat: Infinity, repeatType: 'reverse' }}
      />
    </span>
  );
}
