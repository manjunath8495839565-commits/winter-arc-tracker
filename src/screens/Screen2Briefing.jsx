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

  // Long press handler for quote shuffling
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      onShuffleQuote();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(25);
      }
    }, 600);
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
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
      {/* Top Bar with Back Arrow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: 'env(safe-area-inset-top, 8px)'
      }}>
        <button
          onClick={onBackToVigil}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 0',
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.15em'
          }}
        >
          <ArrowLeftIcon size={16} /> VIGIL
        </button>

        <span className="spec-label" style={{ fontSize: '10px', color: 'var(--color-ice)' }}>
          {workout.isDeload ? `WEEK ${workout.week} // DELOAD` : `WEEK ${workout.week} // PROTOCOL`}
        </span>
      </div>

      {/* Top 40%: Today's Quote (Slow fade-in, long-press to shuffle) */}
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
        <p style={{
          fontFamily: 'var(--font-body)',
          fontStyle: 'italic',
          fontSize: '20px',
          lineHeight: 1.5,
          color: 'var(--text-primary)',
          opacity: 0.9,
          maxWidth: '360px',
          margin: 0
        }}>
          "{quote.text}"
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginTop: '12px'
        }}>
          <span className="spec-label" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
            — {quote.author.toUpperCase()}
          </span>
          <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
            (HOLD TO SHUFFLE)
          </span>
        </div>
      </div>

      {/* Bottom 60%: Mission Card (ONLY workout title + 3 summary chips + VIEW PROTOCOL) */}
      <div style={{
        height: '56%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <div className="cold-card" style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            {/* Week & Focus Chip */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="spec-label" style={{
                color: workout.isDeload ? 'var(--color-ember)' : 'var(--color-ice)',
                backgroundColor: 'rgba(30, 35, 46, 0.6)',
                padding: '4px 8px',
                borderRadius: 'var(--radius-sm)'
              }}>
                {workout.isDeload ? `WEEK ${workout.week} — DELOAD` : `WEEK ${workout.week} — BASELINE`}
              </span>
            </div>

            {/* ONLY the Workout Title (Max 7 words) */}
            <h2
              className="font-hero"
              style={{
                fontSize: '26px',
                lineHeight: 1.15,
                color: 'var(--text-primary)',
                textTransform: 'uppercase',
                marginBottom: '18px'
              }}
            >
              {workout.title}
            </h2>

            {/* 3 Summary Chips: WARMUP 10 / BATTLE 45 / COOLDOWN 5 */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <div style={{
                flex: 1,
                backgroundColor: 'rgba(30, 35, 46, 0.45)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center'
              }}>
                <div className="spec-label" style={{ fontSize: '9px' }}>WARMUP</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '18px', color: 'var(--text-primary)', marginTop: '2px' }}>
                  10
                </div>
              </div>

              <div style={{
                flex: 1.4,
                backgroundColor: 'rgba(30, 35, 46, 0.65)',
                border: '1px solid rgba(255, 92, 26, 0.3)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center'
              }}>
                <div className="spec-label" style={{ fontSize: '9px', color: 'var(--color-ember)' }}>BATTLE</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '18px', color: 'var(--color-ember)', marginTop: '2px' }}>
                  45
                </div>
              </div>

              <div style={{
                flex: 1,
                backgroundColor: 'rgba(30, 35, 46, 0.45)',
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                textAlign: 'center'
              }}>
                <div className="spec-label" style={{ fontSize: '9px' }}>COOLDOWN</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '18px', color: 'var(--text-primary)', marginTop: '2px' }}>
                  5
                </div>
              </div>
            </div>
          </div>

          {/* Collapsed Protocol Button */}
          <div style={{ textAlign: 'center', marginTop: 'auto', marginBottom: '8px' }}>
            <button
              onClick={() => setShowProtocolModal(true)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-ice)',
                fontFamily: 'var(--font-hero)',
                fontSize: '12px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                padding: '6px 12px'
              }}
            >
              VIEW PROTOCOL ({workout.exercises.length} EXERCISES) ↓
            </button>
          </div>
        </div>

        {/* ONE CTA: "LOCK IN — 6:00 AM" pinned to bottom, full width */}
        <div style={{ marginTop: '16px' }}>
          <button
            onClick={onLockIn}
            className="btn-primary-ember"
          >
            LOCK IN — 6:00 AM
          </button>
        </div>
      </div>

      {/* Protocol Preview Drawer (Collapsed by default) */}
      {showProtocolModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          backdropFilter: 'blur(8px)',
          zIndex: 800,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '20px 20px calc(24px + env(safe-area-inset-bottom, 12px)) 20px'
        }}>
          <div className="cold-card" style={{ maxHeight: '80vh', display: 'flex', flexDirection: 'column', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="spec-label" style={{ color: 'var(--color-ice)' }}>
                PROTOCOL DETAILS
              </span>
              <button
                onClick={() => setShowProtocolModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
              {workout.exercises.map((ex, i) => (
                <div key={ex.id || i} style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
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

            <button
              onClick={() => setShowProtocolModal(false)}
              className="btn-secondary"
              style={{ marginTop: '16px' }}
            >
              CLOSE PROTOCOL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
