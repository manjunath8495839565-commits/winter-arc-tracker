import React from 'react';
import { FlameSolidIcon, TrophyIcon } from './Icons';

export function ArcCompleteScreen({ streakData, onStartNewArc }) {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#0A0C10',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '48px 24px calc(36px + env(safe-area-inset-bottom, 0px)) 24px',
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      textAlign: 'center'
    }}>
      <div className="spec-label" style={{ color: 'var(--color-ember)', letterSpacing: '0.3em' }}>
        MISSION ACCOMPLISHED • 90 / 90 DAYS
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '380px' }}>
        <div className="animate-flame" style={{ marginBottom: '24px' }}>
          <FlameSolidIcon size={96} />
        </div>

        <h1
          className="font-hero"
          style={{
            fontSize: '38px',
            lineHeight: 1.05,
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            marginBottom: '16px'
          }}
        >
          ARC COMPLETE.
        </h1>

        <p style={{
          fontSize: '15px',
          lineHeight: 1.6,
          color: 'var(--text-secondary)',
          marginBottom: '28px'
        }}>
          90 days of freezing dawns. 90 days of cold iron. While the world slept, you forged an unbreakable spirit.
        </p>

        {/* Final Stats Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px',
          width: '100%',
          marginBottom: '24px'
        }}>
          <div className="cold-card" style={{ padding: '16px' }}>
            <div className="spec-label" style={{ fontSize: '10px' }}>BATTLES WON</div>
            <div className="font-hero" style={{ fontSize: '32px', color: 'var(--color-ember)' }}>
              {streakData.totalWorkouts} / 90
            </div>
          </div>
          <div className="cold-card" style={{ padding: '16px' }}>
            <div className="spec-label" style={{ fontSize: '10px' }}>HOURS TRAINED</div>
            <div className="font-hero" style={{ fontSize: '32px', color: 'var(--color-ice)' }}>
              {streakData.totalHours}H
            </div>
          </div>
        </div>
      </div>

      <div style={{ width: '100%', maxWidth: '380px' }}>
        <button
          onClick={onStartNewArc}
          className="btn-primary-ember"
        >
          FORGE NEW ARC
        </button>
      </div>
    </div>
  );
}

export function CelebrationModal({ arcDay }) {
  return (
    <>
      {/* 200ms ember vignette flash */}
      <div className="vignette-flash" />

      {/* Centered Celebration Banner */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 12, 16, 0.92)',
        backdropFilter: 'blur(8px)',
        zIndex: 9000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        animation: 'fadeInFast 150ms ease-out forwards'
      }}>
        <div className="animate-flame" style={{ marginBottom: '16px' }}>
          <FlameSolidIcon size={72} />
        </div>

        <h1
          className="font-hero"
          style={{
            fontSize: '32px',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
            marginBottom: '12px',
            lineHeight: 1.15
          }}
        >
          DAY {String(arcDay).padStart(2, '0')} — DONE.
        </h1>

        <p
          className="font-hero"
          style={{
            fontSize: '20px',
            color: 'var(--color-ember)',
            letterSpacing: '0.08em',
            textShadow: '0 0 20px var(--glow-ember-intense)'
          }}
        >
          THE ARC GROWS.
        </p>
      </div>
    </>
  );
}
