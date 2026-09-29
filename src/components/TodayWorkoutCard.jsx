import React from 'react';
import { ArrowRightIcon, CheckIcon } from './Icons';

export function TodayWorkoutCard({
  workout,
  tomorrowWorkout,
  isCompletedToday,
  onLockIn,
  showTomorrowPreview
}) {
  if (!workout) return null;

  return (
    <div style={{ width: '100%', padding: '0 20px', marginBottom: '24px' }}>
      {/* The Cold Card */}
      <div className="cold-card" style={{ padding: '24px 20px' }}>
        {/* Top Header Tag */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <span className="spec-label" style={{ color: 'var(--color-ice)' }}>
            WEEK {workout.week} • 60 MINUTE BATTLE
          </span>
          {workout.isDeload && (
            <span className="spec-label" style={{ color: 'var(--color-ember)' }}>
              DELOAD / TEST
            </span>
          )}
        </div>

        {/* Big Aggressive Title */}
        <h2
          className="font-hero"
          style={{
            fontSize: '24px',
            lineHeight: 1.15,
            color: 'var(--text-primary)',
            marginBottom: '16px',
            textTransform: 'uppercase'
          }}
        >
          {workout.title}
        </h2>

        {/* 60 Min Breakdown Spec */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '20px',
          paddingBottom: '16px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ flex: 1, backgroundColor: 'rgba(30, 35, 46, 0.4)', padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}>
            <div className="spec-label" style={{ fontSize: '9px' }}>WARMUP</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>10 MIN</div>
          </div>
          <div style={{ flex: 2, backgroundColor: 'rgba(30, 35, 46, 0.4)', padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}>
            <div className="spec-label" style={{ fontSize: '9px' }}>MAIN COMPOUND</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-ember)' }}>45 MIN</div>
          </div>
          <div style={{ flex: 1, backgroundColor: 'rgba(30, 35, 46, 0.4)', padding: '6px 8px', borderRadius: 'var(--radius-sm)' }}>
            <div className="spec-label" style={{ fontSize: '9px' }}>COOLDOWN</div>
            <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>5 MIN</div>
          </div>
        </div>

        {/* 6 Exercise Rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {workout.exercises.map((ex, index) => (
            <div
              key={ex.id || index}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                paddingBottom: '8px',
                borderBottom: index < workout.exercises.length - 1 ? '1px solid rgba(30, 35, 46, 0.5)' : 'none'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                  {ex.name}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {ex.target}
                </span>
              </div>
              <div style={{
                textAlign: 'right',
                whiteSpace: 'nowrap',
                fontFamily: 'var(--font-hero)',
                fontSize: '13px',
                letterSpacing: '0.04em',
                color: 'var(--color-ice)'
              }}>
                {ex.sets} × {ex.reps || ex.displayReps}
              </div>
            </div>
          ))}
        </div>

        {/* Massive Full-Width Button: "LOCK IN — 6:00 AM" */}
        <button
          onClick={onLockIn}
          className="btn-primary-ember"
          style={{
            backgroundColor: isCompletedToday ? '#1F2430' : 'var(--color-ember)',
            color: isCompletedToday ? 'var(--color-success)' : '#0A0C10',
            border: isCompletedToday ? '1px solid var(--border-subtle)' : 'none',
            boxShadow: isCompletedToday ? 'none' : '0 4px 24px var(--glow-ember-intense), 0 0 40px var(--glow-ember)'
          }}
        >
          {isCompletedToday ? (
            <>
              <CheckIcon size={20} color="var(--color-success)" />
              <span>COMPLETED — ENTER GYM</span>
            </>
          ) : (
            <>
              <span>LOCK IN — 6:00 AM</span>
              <ArrowRightIcon size={18} color="#0A0C10" />
            </>
          )}
        </button>
      </div>

      {/* Preview Strip under today if before workout or next day preview */}
      {showTomorrowPreview && tomorrowWorkout && (
        <div style={{
          marginTop: '12px',
          padding: '12px 16px',
          backgroundColor: 'rgba(18, 21, 28, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span className="spec-label" style={{ fontSize: '10px', color: 'var(--color-ice)' }}>
              TOMORROW'S PREVIEW
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-secondary)' }}>
              {tomorrowWorkout.shortName} — {tomorrowWorkout.target}
            </span>
          </div>
          <span className="spec-label" style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
            6:00 AM
          </span>
        </div>
      )}
    </div>
  );
}
