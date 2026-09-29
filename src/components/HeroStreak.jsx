import React from 'react';
import { FlameSolidIcon } from './Icons';

export function HeroStreak({ arcDay, streakCount, totalDays = 90 }) {
  const size = 260;
  const strokeWidth = 3.5;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  // Progress based on streak out of 90
  const progressRatio = Math.min(1, Math.max(0, streakCount / totalDays));
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      margin: '20px auto 16px auto',
      width: `${size}px`,
      height: `${size}px`
    }}>
      {/* Background radial glow */}
      <div style={{
        position: 'absolute',
        width: '180px',
        height: '180px',
        borderRadius: '50%',
        backgroundColor: 'var(--glow-ember)',
        filter: 'blur(36px)',
        pointerEvents: 'none'
      }} />

      {/* Circular Progress Ring */}
      <svg
        width={size}
        height={size}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'rotate(-90deg)',
          pointerEvents: 'none'
        }}
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-subtle)"
          strokeWidth={strokeWidth}
        />
        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-ember)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2, 0.8, 0.2, 1)',
            filter: 'drop-shadow(0 0 6px rgba(255, 92, 26, 0.6))'
          }}
        />
      </svg>

      {/* Inner Content */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        textAlign: 'center'
      }}>
        {/* Flame SVG with flicker animation */}
        <div className="animate-flame" style={{ marginBottom: '-6px' }}>
          <FlameSolidIcon size={56} />
        </div>

        {/* Hero Day Number (96-120px Archivo Black) */}
        <div
          className="font-hero tabular-nums"
          style={{
            fontSize: '92px',
            lineHeight: 0.85,
            color: 'var(--text-primary)',
            textShadow: '0 0 24px rgba(255, 92, 26, 0.25)',
            letterSpacing: '-0.04em'
          }}
        >
          {String(arcDay).padStart(2, '0')}
        </div>

        {/* Small label right below number */}
        <div
          className="spec-label"
          style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: 'var(--color-ember)',
            marginTop: '8px'
          }}
        >
          DAY {arcDay} OF {totalDays}
        </div>
      </div>

      {/* Warning Spec Tag */}
      <div
        className="spec-label"
        style={{
          position: 'absolute',
          bottom: '-28px',
          width: '100%',
          textAlign: 'center',
          fontSize: '10px',
          letterSpacing: '0.18em',
          color: 'var(--text-muted)'
        }}
      >
        STREAK — ONE MISSED DAY = BACK TO ZERO
      </div>
    </div>
  );
}
