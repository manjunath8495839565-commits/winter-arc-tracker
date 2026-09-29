import React, { useState } from 'react';
import { ArrowLeftIcon, CloseIcon } from '../components/Icons';

export function Screen2Briefing({
  quote,
  workout,
  onShuffleQuote,
  onLockIn,
  onBackToVigil
}) {
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);

  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      onShuffleQuote();
      if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);
    }, 600);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) { clearTimeout(longPressTimer); setLongPressTimer(null); }
  };

  const isDeload = workout?.isDeload;
  /* Week chip: cyan tint bg + deep cyan text for contrast */
  const weekChipStyle = {
    color: isDeload ? 'var(--color-ember-deep)' : 'var(--color-ice)',
    backgroundColor: isDeload ? 'var(--color-ember-badge)' : 'var(--color-ice-tint)',
    border: `1px solid ${isDeload ? 'rgba(255,77,0,0.25)' : 'rgba(0,144,184,0.25)'}`,
    padding: '4px 10px',
    borderRadius: 'var(--radius-sm)',
    fontSize: '9px',
    fontWeight: 600,
    letterSpacing: '0.18em',
    textTransform: 'uppercase'
  };

  return (
    <div className="animate-slide-up" style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: 'var(--bg-deep)',
      padding: '20px 20px calc(24px + env(safe-area-inset-bottom, 12px)) 20px',
      position: 'relative'
    }}>
      {/* Top bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 'env(safe-area-inset-top, 8px)' }}>
        <button
          onClick={onBackToVigil}
          style={{
            background: 'none', border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '6px',
            padding: '4px 0',
            fontFamily: 'var(--font-body)',
            fontSize: '12px', fontWeight: 600, letterSpacing: '0.15em',
            textTransform: 'uppercase'
          }}
        >
          <ArrowLeftIcon size={16} /> VIGIL
        </button>

        <span style={weekChipStyle}>
          {isDeload ? `WEEK ${workout.week} // DELOAD` : `WEEK ${workout.week} // PROTOCOL`}
        </span>
      </div>

      {/* Quote block — top 40% */}
      <div
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          height: '38%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          padding: '0 12px',
          cursor: 'pointer'
        }}
        title="Long press to shuffle quote"
      >
        {/* Decorative divider line above */}
        <div style={{ width: '36px', height: '2px', backgroundColor: 'var(--color-ice-tint)', borderRadius: '1px', marginBottom: '18px' }} />

        <p style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: '19px',
          lineHeight: 1.55,
          color: 'var(--text-primary)',
          maxWidth: '360px',
          margin: 0
        }}>
          "{quote.text}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px' }}>
          <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--border-subtle)' }} />
          <span className="spec-label" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            {quote.author.toUpperCase()}
          </span>
          <div style={{ width: '24px', height: '1px', backgroundColor: 'var(--border-subtle)' }} />
        </div>

        <span style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '6px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          HOLD TO SHUFFLE
        </span>
      </div>

      {/* Mission card — bottom 60% */}
      <div style={{ height: '56%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div className="cold-card" style={{ padding: '22px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Week chip inside card */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <span style={weekChipStyle}>
                {isDeload ? `WEEK ${workout.week} — DELOAD` : `WEEK ${workout.week} — BASELINE`}
              </span>
            </div>

            {/* Workout title */}
            <h2 className="font-hero" style={{ fontSize: '26px', lineHeight: 1.15, color: 'var(--text-primary)', marginBottom: '18px' }}>
              {workout.title}
            </h2>

            {/* Time chips: WARMUP / BATTLE / COOLDOWN */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {/* WARMUP */}
              <div style={{
                flex: 1,
                backgroundColor: 'var(--surface-inset)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center'
              }}>
                <div className="spec-label" style={{ fontSize: '9px' }}>WARMUP</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '18px', color: 'var(--text-primary)', marginTop: '2px' }}>10</div>
              </div>

              {/* BATTLE — ember accent */}
              <div style={{
                flex: 1.4,
                background: 'var(--color-ember-badge)',
                border: '1px solid rgba(255,77,0,0.3)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center'
              }}>
                <div className="spec-label" style={{ fontSize: '9px', color: 'var(--color-ember-deep)' }}>BATTLE</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '18px', color: 'var(--color-ember)', marginTop: '2px' }}>45</div>
              </div>

              {/* COOLDOWN */}
              <div style={{
                flex: 1,
                backgroundColor: 'var(--surface-inset)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center'
              }}>
                <div className="spec-label" style={{ fontSize: '9px' }}>COOLDOWN</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '18px', color: 'var(--text-primary)', marginTop: '2px' }}>5</div>
              </div>
            </div>
          </div>

          {/* View Protocol link */}
          <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '8px' }}>
            <button
              onClick={() => setShowProtocolModal(true)}
              style={{
                background: 'none', border: 'none',
                color: 'var(--color-ice)',
                fontFamily: 'var(--font-hero)',
                fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase',
                cursor: 'pointer', padding: '6px 12px',
                textDecoration: 'underline', textUnderlineOffset: '3px'
              }}
            >
              VIEW PROTOCOL ({workout.exercises.length} EXERCISES) ↓
            </button>
          </div>
        </div>

        {/* LOCK IN CTA */}
        <div style={{ marginTop: '16px' }}>
          <button onClick={onLockIn} className="btn-primary-ember" id="lock-in-btn">
            LOCK IN — 6:00 AM
          </button>
        </div>
      </div>

      {/* Protocol drawer */}
      {showProtocolModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(11, 18, 32, 0.45)',
          backdropFilter: 'blur(12px)',
          zIndex: 800,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: '20px 20px calc(24px + env(safe-area-inset-bottom, 12px)) 20px'
        }}>
          <div className="cold-card" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="spec-label" style={{ color: 'var(--color-ice)' }}>PROTOCOL DETAILS</span>
              <button onClick={() => setShowProtocolModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <CloseIcon size={20} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
              {workout.exercises.map((ex, i) => (
                <div key={ex.id || i} style={{
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border-subtle)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{ex.name}</div>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{ex.target}</div>
                  </div>
                  <div className="font-hero tabular-nums" style={{ fontSize: '13px', color: 'var(--color-ice)' }}>
                    {ex.sets} × {ex.reps || ex.displayReps}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setShowProtocolModal(false)} className="btn-secondary" style={{ marginTop: '16px' }}>
              CLOSE PROTOCOL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
