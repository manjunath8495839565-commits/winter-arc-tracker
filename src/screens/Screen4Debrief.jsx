import React, { useState, useEffect } from 'react';
import { FlameSolidIcon } from '../components/Icons';
import { playWorkoutLoggedSound } from '../utils/audio';

export function Screen4Debrief({
  arcDay,
  summaryData,
  streakCount,
  onReturnToVigil,
  soundEnabled = true
}) {
  const [phase, setPhase] = useState('flash'); // 'flash' (2s hold) -> 'summary'

  useEffect(() => {
    // Sound & Haptic on mount
    if (soundEnabled) {
      playWorkoutLoggedSound();
    }

    // 2-second hold of the victory banner, then show summary
    const timer = setTimeout(() => {
      setPhase('summary');
    }, 2000);

    return () => clearTimeout(timer);
  }, [soundEnabled]);

  const size = 180;
  const strokeWidth = 4;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.min(1, Math.max(0, streakCount / 90));
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0A0C10',
      zIndex: 700,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '36px 24px calc(24px + env(safe-area-inset-bottom, 12px)) 24px',
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      textAlign: 'center',
      overflow: 'hidden'
    }}>
      {/* 200ms Ember Flash */}
      <div className="vignette-flash" />

      {phase === 'flash' ? (
        /* Phase 1: 2-Second Dramatic Victory Beat */
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeInFast 200ms ease-out forwards'
        }}>
          <div className="animate-flame" style={{ marginBottom: '20px' }}>
            <FlameSolidIcon size={80} />
          </div>

          <h1
            className="font-hero"
            style={{
              fontSize: '34px',
              color: 'var(--text-primary)',
              letterSpacing: '0.04em',
              marginBottom: '10px',
              lineHeight: 1.1
            }}
          >
            DAY {String(arcDay).padStart(2, '0')} — LOGGED.
          </h1>

          <p
            className="font-hero"
            style={{
              fontSize: '18px',
              color: 'var(--color-ember)',
              letterSpacing: '0.12em',
              textShadow: '0 0 24px var(--glow-ember-intense)'
            }}
          >
            THE ARC GROWS.
          </p>
        </div>
      ) : (
        /* Phase 2: Debrief Quick Stats & Streak Ring */
        <div style={{
          width: '100%',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          alignItems: 'center',
          animation: 'fadeInFast 200ms ease-out forwards'
        }}>
          {/* Top Spec Header */}
          <div className="spec-label" style={{ color: 'var(--color-ember)', letterSpacing: '0.25em' }}>
            DEBRIEF // SESSION SEALED
          </div>

          {/* Refilled Streak Ring with 300ms Ember Sweep */}
          <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '20px 0' }}>
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="var(--border-subtle)"
                strokeWidth={strokeWidth}
              />
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
                  transition: 'stroke-dashoffset 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: 'drop-shadow(0 0 10px rgba(255, 92, 26, 0.7))'
                }}
              />
            </svg>

            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}>
              <div className="animate-flame" style={{ marginBottom: '2px' }}>
                <FlameSolidIcon size={28} />
              </div>
              <div className="font-hero tabular-nums" style={{ fontSize: '42px', lineHeight: 1, color: 'var(--text-primary)' }}>
                {streakCount}
              </div>
              <div className="spec-label" style={{ fontSize: '9px', color: 'var(--color-ember)' }}>
                DAYS FORGED
              </div>
            </div>
          </div>

          {/* 3 Quick Stats: Duration, Sets Done, Exercises Completed */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            width: '100%',
            marginBottom: '24px'
          }}>
            <div className="cold-card" style={{ padding: '14px 8px', textAlign: 'center' }}>
              <div className="spec-label" style={{ fontSize: '9px' }}>DURATION</div>
              <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--text-primary)', marginTop: '4px' }}>
                {Math.round((summaryData?.duration || 3600) / 60)}M
              </div>
            </div>

            <div className="cold-card" style={{ padding: '14px 8px', textAlign: 'center' }}>
              <div className="spec-label" style={{ fontSize: '9px' }}>SETS DONE</div>
              <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--color-ember)', marginTop: '4px' }}>
                {summaryData?.setsDone || 18}
              </div>
            </div>

            <div className="cold-card" style={{ padding: '14px 8px', textAlign: 'center' }}>
              <div className="spec-label" style={{ fontSize: '9px' }}>EXERCISES</div>
              <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--color-ice)', marginTop: '4px' }}>
                {summaryData?.exercisesCount || 6}
              </div>
            </div>
          </div>

          {/* One CTA Button: RETURN TO VIGIL */}
          <div style={{ width: '100%' }}>
            <button
              onClick={onReturnToVigil}
              className="btn-primary-ember"
            >
              RETURN TO VIGIL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
