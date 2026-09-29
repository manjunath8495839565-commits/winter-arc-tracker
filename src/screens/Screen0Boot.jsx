import React, { useState, useEffect } from 'react';
import { playWorkoutLoggedSound } from '../utils/audio';

export function Screen0Boot({ onComplete, isWorkoutDoneToday, soundEnabled = true }) {
  const [splitting, setSplitting] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    // Check if opened between 5:30 AM and 7:00 AM and workout not done
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const timeInMins = hours * 60 + minutes;
    const isWakeUpWindow = timeInMins >= 330 && timeInMins <= 420; // 5:30 to 7:00 AM

    if (isWakeUpWindow && !isWorkoutDoneToday) {
      setShaking(true);
      if (soundEnabled) {
        playWorkoutLoggedSound();
      }
    }

    // Auto-split open after 800ms, complete by 1100ms (max 1.2s per spec)
    const splitTimer = setTimeout(() => {
      setSplitting(true);
    }, 700);

    const endTimer = setTimeout(() => {
      onComplete();
    }, 1100);

    return () => {
      clearTimeout(splitTimer);
      clearTimeout(endTimer);
    };
  }, [isWorkoutDoneToday, soundEnabled, onComplete]);

  // Tap anywhere to skip instantly
  const handleTapSkip = () => {
    setSplitting(true);
    setTimeout(onComplete, 80);
  };

  return (
    <div
      onClick={handleTapSkip}
      className={shaking ? 'animate-wake-shake' : ''}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Left Shutter Door */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: '50%',
        backgroundColor: '#000000',
        borderRight: '1px solid var(--border-subtle)',
        transform: splitting ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1
      }} />

      {/* Right Shutter Door */}
      <div style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: '50%',
        backgroundColor: '#000000',
        borderLeft: '1px solid var(--border-subtle)',
        transform: splitting ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 300ms cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1
      }} />

      {/* Center Logo with Ember Pulse */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 2,
        opacity: splitting ? 0 : 1,
        transition: 'opacity 200ms ease-out'
      }}>
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          padding: '2px',
          backgroundColor: 'rgba(255, 92, 26, 0.1)',
          boxShadow: '0 0 32px var(--glow-ember-intense), 0 0 60px var(--glow-ember)',
          animation: 'flameFlicker 1.2s ease-in-out infinite'
        }}>
          <img
            src="./logo.png"
            alt="Gym Tracker Emblem"
            style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
          />
        </div>

        <div
          className="spec-label"
          style={{
            marginTop: '20px',
            fontSize: '11px',
            letterSpacing: '0.3em',
            color: 'var(--text-secondary)'
          }}
        >
          WINTER ARC // BOOT
        </div>
      </div>
    </div>
  );
}
