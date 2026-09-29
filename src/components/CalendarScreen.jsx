import React, { useState } from 'react';
import { getWorkoutForDay } from '../data/workoutPlan';
import { CheckIcon, CloseIcon } from './Icons';

export function CalendarScreen({
  arcDay,
  logs,
  streakData,
  onToggleDayStatus
}) {
  const [selectedDay, setSelectedDay] = useState(null);

  // Generate 90 day slots (1 to 90)
  const daysArray = Array.from({ length: 90 }, (_, i) => i + 1);

  const getDayStatus = (dayNum) => {
    const isCompleted = Boolean(logs[dayNum] && logs[dayNum].completionTimestamp);
    const isToday = dayNum === arcDay;
    const isPast = dayNum < arcDay;

    if (isCompleted) return 'completed';
    if (isToday) return 'today';
    if (isPast) return 'missed';
    return 'future';
  };

  const selectedWorkout = selectedDay ? getWorkoutForDay(selectedDay) : null;
  const selectedLog = selectedDay ? logs[selectedDay] : null;

  return (
    <div className="page-transition" style={{ padding: '24px 20px', width: '100%' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px', textAlign: 'center' }}>
        <h1
          className="font-hero"
          style={{
            fontSize: '28px',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            marginBottom: '4px'
          }}
        >
          90 DAYS. 90 BATTLES.
        </h1>
        <p className="spec-label" style={{ color: 'var(--color-ice)' }}>
          DISCIPLINE GRID • ZERO COMPROMISES
        </p>
      </div>

      {/* GitHub-Style Heatmap Grid: 10 rows x 9 columns (90 blocks) */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '20px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(9, 1fr)',
          gridAutoRows: '34px',
          gap: '4px',
          justifyContent: 'center'
        }}>
          {daysArray.map((d) => {
            const status = getDayStatus(d);

            let bg = 'var(--border-subtle)'; // future
            let border = '1px solid transparent';
            let boxShadow = 'none';
            let textColor = 'var(--text-muted)';
            let isPulsing = false;

            if (status === 'completed') {
              bg = 'var(--color-ember)';
              boxShadow = '0 0 8px rgba(255, 92, 26, 0.4)';
              textColor = '#0A0C10';
            } else if (status === 'missed') {
              bg = 'var(--color-missed)';
              textColor = '#FCA5A5';
            } else if (status === 'today') {
              bg = '#161A23';
              border = '1.5px solid var(--color-ember)';
              textColor = 'var(--color-ember)';
              isPulsing = true;
            }

            return (
              <button
                key={d}
                onClick={() => setSelectedDay(d)}
                className={isPulsing ? 'animate-pulse-outline' : ''}
                style={{
                  backgroundColor: bg,
                  border: border,
                  boxShadow: boxShadow,
                  borderRadius: '3px', // 3px radius per spec
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontFamily: 'var(--font-hero)',
                  color: textColor,
                  position: 'relative',
                  transition: 'transform 0.1s ease',
                  padding: 0
                }}
                title={`Day ${d}: ${status.toUpperCase()}`}
              >
                {d}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '10px',
          color: 'var(--text-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-ember)' }} />
            <span>FORGED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--color-missed)' }} />
            <span>MISSED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', border: '1px solid var(--color-ember)' }} />
            <span>TODAY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '2px', backgroundColor: 'var(--border-subtle)' }} />
            <span>FUTURE</span>
          </div>
        </div>
      </div>

      {/* Grid Spec Footnote */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 4px',
        marginBottom: '24px'
      }}>
        <span className="spec-label" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          LONGEST STREAK: {streakData.longestStreak} DAYS
        </span>
        <span className="spec-label" style={{ fontSize: '11px', color: 'var(--color-ember)' }}>
          CURRENT: {streakData.currentStreak} DAYS
        </span>
      </div>

      {/* Selected Day Inspector Popover / Modal */}
      {selectedDay && selectedWorkout && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 700
        }}>
          <div className="cold-card" style={{ maxWidth: '400px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span className="spec-label" style={{ color: 'var(--color-ice)' }}>
                DAY {selectedDay} / 90 • {selectedWorkout.shortName}
              </span>
              <button
                onClick={() => setSelectedDay(null)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <h3 className="font-hero" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {selectedWorkout.title}
            </h3>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Target: {selectedWorkout.target}
            </p>

            <div style={{
              backgroundColor: 'rgba(30, 35, 46, 0.4)',
              borderRadius: 'var(--radius-sm)',
              padding: '12px',
              marginBottom: '20px',
              fontSize: '12px',
              color: 'var(--text-primary)'
            }}>
              <div style={{ marginBottom: '6px' }}>
                <strong>Status: </strong>
                {getDayStatus(selectedDay) === 'completed' ? (
                  <span style={{ color: 'var(--color-success)' }}>FORGED (COMPLETED)</span>
                ) : getDayStatus(selectedDay) === 'missed' ? (
                  <span style={{ color: 'var(--color-danger)' }}>MISSED BATTLE</span>
                ) : getDayStatus(selectedDay) === 'today' ? (
                  <span style={{ color: 'var(--color-ember)' }}>ACTIVE TODAY</span>
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>UPCOMING</span>
                )}
              </div>
              {selectedLog && selectedLog.completionTimestamp && (
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Logged at: {new Date(selectedLog.completionTimestamp).toLocaleString()}
                </div>
              )}
            </div>

            {/* Toggle Status action */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  onToggleDayStatus(selectedDay);
                  setSelectedDay(null);
                }}
                className="btn-primary-ember"
                style={{
                  padding: '12px',
                  fontSize: '13px',
                  backgroundColor: getDayStatus(selectedDay) === 'completed' ? '#2C3445' : 'var(--color-ember)',
                  color: getDayStatus(selectedDay) === 'completed' ? 'var(--text-primary)' : '#0A0C10'
                }}
              >
                {getDayStatus(selectedDay) === 'completed' ? 'MARK INCOMPLETE' : 'MARK FORGED'}
              </button>
              <button
                onClick={() => setSelectedDay(null)}
                className="btn-secondary"
                style={{ padding: '12px', fontSize: '13px' }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
