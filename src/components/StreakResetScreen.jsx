import React, { useEffect } from 'react';
import { LightningCrackIcon } from './Icons';
import { playStormRumbleSound } from '../utils/audio';

export function StreakResetScreen({ missedDay, onBeginAgain, soundEnabled = true }) {
  useEffect(() => {
    if (soundEnabled) playStormRumbleSound();
  }, [soundEnabled]);

  return (
    <div style={{
      position: 'fixed', inset: 0,
      /* Light bg — but with a faint warm danger blush to signal alarm */
      backgroundColor: '#FDF4F5',
      zIndex: 1000,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center',
      padding: '48px 24px calc(36px + env(safe-area-inset-bottom, 0px)) 24px',
      maxWidth: 'var(--max-width)', margin: '0 auto',
      textAlign: 'center'
    }}>
      {/* BREACH label */}
      <div className="spec-label" style={{ color: 'var(--color-danger)', letterSpacing: '0.3em' }}>
        BREACH DETECTED
      </div>

      {/* Center */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '380px' }}>
        {/* Magenta lightning — the "urgency" accent for reset screen */}
        <div style={{
          filter: 'drop-shadow(0 0 16px rgba(224,30,122,0.45))',
          marginBottom: '32px',
          animation: 'flameFlicker 1.5s ease-in-out infinite'
        }}>
          <LightningCrackIcon size={110} color="var(--color-magenta)" />
        </div>

        <h1 className="font-hero" style={{
          fontSize: '36px',
          lineHeight: 1.05,
          color: 'var(--text-primary)',
          letterSpacing: '-0.02em',
          marginBottom: '20px'
        }}>
          YOU BROKE THE CHAIN.
        </h1>

        <p style={{ fontSize: '15px', lineHeight: 1.65, color: 'var(--text-secondary)', margin: '0 auto' }}>
          Day {missedDay || 1} is gone. It doesn't matter why. It matters what you do at 6 AM tomorrow.
        </p>

        <p style={{
          fontSize: '13px',
          color: 'var(--color-danger)',
          marginTop: '16px',
          fontFamily: 'var(--font-hero)',
          letterSpacing: '0.08em'
        }}>
          NO EXCUSES. NO COMFORT HERE.
        </p>
      </div>

      {/* CTA */}
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <button onClick={onBeginAgain} className="btn-danger-outline">
          BEGIN AGAIN. DAY 1.
        </button>
      </div>
    </div>
  );
}
