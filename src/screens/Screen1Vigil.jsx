import React from 'react';
import { FlameSolidIcon } from '../components/Icons';

export function Screen1Vigil({
  arcDay,
  streakCount,
  totalDays = 90,
  onProceedToBriefing,
  onOpenArchive
}) {
  const size = 300;
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, streakCount / totalDays));
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '24px 20px calc(24px + env(safe-area-inset-bottom, 12px)) 20px',
      position: 'relative',
      userSelect: 'none'
    }}>
      {/* Top minimal spec header */}
      <div style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'env(safe-area-inset-top, 8px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src="./logo.png"
            alt="Logo"
            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <span className="spec-label" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            STATUS // VIGIL
          </span>
        </div>

        <button
          onClick={onOpenArchive}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '6px 8px'
          }}
        >
          ARCHIVE
        </button>
      </div>

      {/* Center: Giant Streak Ring ONLY (Tap anywhere on ring -> go to Screen 2) */}
      <div
        onClick={onProceedToBriefing}
        style={{
          position: 'relative',
          width: `${size}px`,
          height: `${size}px`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          margin: 'auto 0'
        }}
        title="Tap to view Mission Briefing"
      >
        {/* Subtle Ember Ambient Glow */}
        <div style={{
          position: 'absolute',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          backgroundColor: 'var(--glow-ember)',
          filter: 'blur(45px)',
          pointerEvents: 'none'
        }} />

        {/* Circular Ring SVG */}
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
          {/* Base Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border-subtle)"
            strokeWidth={strokeWidth}
          />
          {/* Progress Stroke */}
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
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: 'drop-shadow(0 0 8px rgba(255, 92, 26, 0.65))'
            }}
          />
        </svg>

        {/* Flame at the Ring's Top Notch */}
        <div style={{
          position: 'absolute',
          top: '-16px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 3
        }}>
          <div className="animate-flame">
            <FlameSolidIcon size={34} />
          </div>
        </div>

        {/* Day Number Inside Ring */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
          textAlign: 'center'
        }}>
          <div
            className="font-hero tabular-nums"
            style={{
              fontSize: '110px',
              lineHeight: 0.82,
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              textShadow: '0 0 32px rgba(255, 92, 26, 0.3)'
            }}
          >
            {String(arcDay).padStart(2, '0')}
          </div>

          <div
            className="spec-label"
            style={{
              fontSize: '11px',
              letterSpacing: '0.25em',
              color: 'var(--color-ember)',
              marginTop: '12px'
            }}
          >
            DAY {arcDay} // 90
          </div>
        </div>
      </div>

      {/* Bottom text: ONE MISSED DAY = ZERO */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div
          className="spec-label"
          style={{
            fontSize: '11px',
            letterSpacing: '0.22em',
            color: 'var(--text-secondary)'
          }}
        >
          ONE MISSED DAY = ZERO
        </div>

        <div style={{
          fontSize: '10px',
          color: 'var(--text-muted)',
          marginTop: '6px',
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          TAP RING TO ENTER BRIEFING
        </div>
      </div>
    </div>
  );
}
