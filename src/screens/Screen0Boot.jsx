import React, { useState, useEffect } from 'react';
import { playWorkoutLoggedSound } from '../utils/audio';

export function Screen0Boot({ onComplete, isWorkoutDoneToday, soundEnabled = true }) {
  const [splitting, setSplitting] = useState(false);
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    const now = new Date();
    const timeInMins = now.getHours() * 60 + now.getMinutes();
    const isWakeUpWindow = timeInMins >= 330 && timeInMins <= 420; // 5:30–7:00 AM

    if (isWakeUpWindow && !isWorkoutDoneToday) {
      setShaking(true);
      if (soundEnabled) playWorkoutLoggedSound();
    }

    const splitTimer = setTimeout(() => setSplitting(true), 700);
    const endTimer   = setTimeout(() => onComplete(), 1100);
    return () => { clearTimeout(splitTimer); clearTimeout(endTimer); };
  }, [isWorkoutDoneToday, soundEnabled, onComplete]);

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
        /* Boot stays coal-black — cinematic cold-open contrast before light floods in */
        backgroundColor: '#06080D',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer'
      }}
    >
      {/* Left Shutter */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, left: 0, width: '50%',
        backgroundColor: '#06080D',
        borderRight: '1px solid rgba(255,77,0,0.18)',
        transform: splitting ? 'translateX(-100%)' : 'translateX(0)',
        transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1
      }} />

      {/* Right Shutter */}
      <div style={{
        position: 'absolute', top: 0, bottom: 0, right: 0, width: '50%',
        backgroundColor: '#06080D',
        borderLeft: '1px solid rgba(255,77,0,0.18)',
        transform: splitting ? 'translateX(100%)' : 'translateX(0)',
        transition: 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
        zIndex: 1
      }} />

      {/* Amber ambient halo behind logo */}
      <div style={{
        position: 'absolute',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,77,0,0.22) 0%, rgba(255,77,0,0) 70%)',
        animation: 'glowPulse 3s ease-in-out infinite',
        pointerEvents: 'none',
        zIndex: 2
      }} />

      {/* Logo with ember ring */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 3,
        opacity: splitting ? 0 : 1,
        transition: 'opacity 200ms ease-out'
      }}>
        <div style={{
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          border: '2px solid rgba(255,77,0,0.55)',
          boxShadow: '0 0 28px rgba(255,77,0,0.45), 0 0 6px rgba(255,77,0,0.6) inset',
          animation: 'flameFlicker 1.4s ease-in-out infinite',
          overflow: 'hidden'
        }}>
          <img
            src="./logo.png"
            alt="Winter Arc"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div
          className="spec-label"
          style={{
            marginTop: '22px',
            fontSize: '10px',
            letterSpacing: '0.34em',
            color: 'rgba(255,255,255,0.45)'
          }}
        >
          WINTER ARC // BOOT
        </div>
      </div>
    </div>
  );
}
