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
  const strokeWidth = 4.5;
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
      userSelect: 'none',
      backgroundColor: 'var(--bg-deep)'
    }}>
      {/* Top bar */}
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
            style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover', boxShadow: '0 0 0 1.5px rgba(255,77,0,0.3)' }}
          />
          <span className="spec-label" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            STATUS // VIGIL
          </span>
        </div>

        <button
          onClick={onOpenArchive}
          style={{
            background: 'none',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            padding: '5px 10px',
            transition: 'background 0.15s, border-color 0.15s'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--surface-card)'; e.currentTarget.style.borderColor = 'var(--border-active)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--border-subtle)'; }}
        >
          ARCHIVE
        </button>
      </div>

      {/* Giant Streak Ring — TAP to Briefing */}
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
        {/* Warm ember tint halo behind ring on light bg */}
        <div
          className="animate-glow-pulse"
          style={{
            position: 'absolute',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,77,0,0.14) 0%, rgba(255,77,0,0) 70%)',
            pointerEvents: 'none'
          }}
        />

        {/* SVG Ring */}
        <svg
          width={size}
          height={size}
          style={{ position: 'absolute', top: 0, left: 0, transform: 'rotate(-90deg)', pointerEvents: 'none' }}
        >
          {/* Track — warm tint */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="var(--color-ember-badge)"
            strokeWidth={strokeWidth}
          />
          {/* Progress — ember gradient arc */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="url(#vigilEmberGrad)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{
              transition: 'stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: 'drop-shadow(0 0 6px rgba(255,77,0,0.45))'
            }}
          />
          <defs>
            <linearGradient id="vigilEmberGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#FF7A1A" />
              <stop offset="55%"  stopColor="#FF4D00" />
              <stop offset="100%" stopColor="#E04A00" />
            </linearGradient>
          </defs>
        </svg>

        {/* Flame at top notch */}
        <div style={{ position: 'absolute', top: '-14px', left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
          <div className="animate-flame">
            <FlameSolidIcon size={32} />
          </div>
        </div>

        {/* Day number inside ring */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, textAlign: 'center' }}>
          <div
            className="font-hero tabular-nums"
            style={{
              fontSize: '112px',
              lineHeight: 0.82,
              color: 'var(--text-primary)',
              letterSpacing: '-0.04em',
              /* Subtle warm glow on day number */
              textShadow: '0 2px 20px rgba(255,77,0,0.18)'
            }}
          >
            {String(arcDay).padStart(2, '0')}
          </div>

          <div
            className="spec-label"
            style={{
              fontSize: '10px',
              letterSpacing: '0.25em',
              /* Use ember-deep so small text has 4.5:1+ contrast on white */
              color: 'var(--color-ember-deep)',
              marginTop: '14px'
            }}
          >
            DAY {arcDay} // 90
          </div>
        </div>
      </div>

      {/* Bottom instruction */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <div className="spec-label" style={{ fontSize: '10px', letterSpacing: '0.22em', color: 'var(--text-secondary)' }}>
          ONE MISSED DAY = ZERO
        </div>
        <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          TAP RING TO ENTER BRIEFING
        </div>
      </div>
    </div>
  );
}
