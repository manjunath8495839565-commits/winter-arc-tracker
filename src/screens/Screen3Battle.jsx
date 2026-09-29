import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../components/Icons';
import { playSetCompleteSound, playRestEndSound, playTimerTickSound } from '../utils/audio';

export function Screen3Battle({
  workout,
  arcDay,
  onCompleteWorkout,
  onExitWorkout,
  restTimerConfig = 60,
  soundEnabled = true
}) {
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(restTimerConfig);
  const [ripplePos, setRipplePos] = useState(null);
  const [undoCountdown, setUndoCountdown] = useState(null);

  const touchStartXRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const restTimerRef = useRef(null);
  const undoTimerRef = useRef(null);

  const currentExercise = workout.exercises[currentExIndex] || workout.exercises[0];
  const totalSets = currentExercise?.sets || 4;
  const isFinalExercise = currentExIndex === workout.exercises.length - 1;
  const isFinalSet = currentSet === totalSets;

  useEffect(() => {
    sessionTimerRef.current = setInterval(() => setSessionSeconds(p => p + 1), 1000);
    return () => { if (sessionTimerRef.current) clearInterval(sessionTimerRef.current); };
  }, []);

  useEffect(() => {
    if (isResting) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsLeft(prev => {
          if (prev <= 4 && prev > 1 && soundEnabled) playTimerTickSound();
          if (prev <= 1) { if (soundEnabled) playRestEndSound(); setIsResting(false); return restTimerConfig; }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }
    return () => { if (restTimerRef.current) clearInterval(restTimerRef.current); };
  }, [isResting, restTimerConfig, soundEnabled]);

  const handleTapScreen = (e) => {
    if (isResting) { setIsResting(false); if (soundEnabled) playRestEndSound(); return; }
    if (undoCountdown !== null) return;

    const rect = e.currentTarget.getBoundingClientRect();
    setRipplePos({ x: e.clientX - rect.left - 70, y: e.clientY - rect.top - 70 });
    setTimeout(() => setRipplePos(null), 250);

    if (soundEnabled) playSetCompleteSound();
    if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(25);

    if (isFinalExercise && isFinalSet) { triggerImplicitFinish(); return; }

    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      setRestSecondsLeft(restTimerConfig);
      setIsResting(true);
    } else {
      setCurrentExIndex(currentExIndex + 1);
      setCurrentSet(1);
      setRestSecondsLeft(restTimerConfig);
      setIsResting(true);
    }
  };

  const triggerImplicitFinish = () => setUndoCountdown(3);

  useEffect(() => {
    if (undoCountdown === null) return;
    if (undoCountdown > 0) {
      undoTimerRef.current = setTimeout(() => setUndoCountdown(undoCountdown - 1), 1000);
    } else {
      onCompleteWorkout({
        duration: sessionSeconds,
        setsDone: workout.exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0),
        exercisesCount: workout.exercises.length
      });
    }
    return () => { if (undoTimerRef.current) clearTimeout(undoTimerRef.current); };
  }, [undoCountdown, sessionSeconds, workout, onCompleteWorkout]);

  const handleCancelFinish = (e) => {
    e.stopPropagation();
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoCountdown(null);
  };

  const handleTouchStart = (e) => { touchStartXRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;
    if (delta < -50 && currentExIndex < workout.exercises.length - 1) { setCurrentExIndex(currentExIndex + 1); setCurrentSet(1); setIsResting(false); }
    else if (delta > 50 && currentExIndex > 0) { setCurrentExIndex(currentExIndex - 1); setCurrentSet(1); setIsResting(false); }
  };

  const sessionProgressPct = Math.min(100, (sessionSeconds / 3600) * 100);

  /* Rest timer ring */
  const circleSize = 220;
  const strokeW = 5;
  const radius = (circleSize - strokeW * 2) / 2;
  const circ = 2 * Math.PI * radius;
  const restRatio = restSecondsLeft / restTimerConfig;
  const restOffset = circ - restRatio * circ;
  const isWarningLast3s = restSecondsLeft <= 3;

  return (
    <div
      onClick={handleTapScreen}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="animate-hard-cut"
      style={{
        position: 'fixed', inset: 0,
        /* BATTLE uses near-white with very faint cool tint for focus — not dark */
        backgroundColor: '#F8FAFЕ',
        zIndex: 500,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center',
        padding: '0 24px calc(24px + env(safe-area-inset-bottom, 12px)) 24px',
        maxWidth: 'var(--max-width)', margin: '0 auto',
        overflow: 'hidden', userSelect: 'none', cursor: 'pointer'
      }}
    >
      {/* Elapsed session bar — ember gradient line at top */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '3px', backgroundColor: 'var(--color-ember-badge)', zIndex: 10 }}>
        <div style={{
          width: `${sessionProgressPct}%`,
          height: '100%',
          background: 'var(--gradient-ember)',
          boxShadow: '0 0 8px rgba(255,77,0,0.5)',
          transition: 'width 1s linear'
        }} />
      </div>

      {/* Tap ripple */}
      {ripplePos && (
        <div className="animate-tap-ripple" style={{ top: ripplePos.y, left: ripplePos.x }} />
      )}

      {/* Header: exercise index / clock / exit */}
      <div style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: 'calc(16px + env(safe-area-inset-top, 8px))'
      }}>
        <div className="spec-label" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>
          EXERCISE {currentExIndex + 1} / {workout.exercises.length}
        </div>

        {/* Session clock — glacier cyan */}
        <div className="font-hero tabular-nums" style={{ fontSize: '14px', color: 'var(--color-ice)' }}>
          {Math.floor(sessionSeconds / 60)}:{String(sessionSeconds % 60).padStart(2, '0')}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onExitWorkout(); }}
          className="btn-ghost-weak"
          style={{ padding: '4px', fontSize: '11px', textDecoration: 'none', color: 'var(--text-muted)' }}
        >
          EXIT
        </button>
      </div>

      {/* Center: exercise name + numerals */}
      <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', flex: 1 }}>
        <h1 className="font-hero" style={{ fontSize: '32px', lineHeight: 1.1, color: 'var(--text-primary)', maxWidth: '380px', marginBottom: '8px' }}>
          {currentExercise.name}
        </h1>

        <div className="spec-label" style={{ fontSize: '11px', letterSpacing: '0.2em', color: 'var(--text-secondary)', marginBottom: '44px' }}>
          {currentExercise.target}
        </div>

        {/* SET / TARGET — glacier cyan Archivo Black numerals */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '40px', marginBottom: '32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spec-label" style={{ fontSize: '11px', marginBottom: '4px', color: 'var(--text-secondary)' }}>SET</div>
            <div className="font-hero tabular-nums" style={{ fontSize: '52px', lineHeight: 1, color: 'var(--color-ice)' }}>
              {currentSet}/{totalSets}
            </div>
          </div>

          <div style={{ width: '1px', height: '60px', backgroundColor: 'var(--border-subtle)' }} />

          <div style={{ textAlign: 'center' }}>
            <div className="spec-label" style={{ fontSize: '11px', marginBottom: '4px', color: 'var(--text-secondary)' }}>TARGET</div>
            <div className="font-hero tabular-nums" style={{ fontSize: '52px', lineHeight: 1, color: 'var(--color-ice)' }}>
              {currentExercise.reps || currentExercise.displayReps}
            </div>
          </div>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', maxWidth: '320px', lineHeight: 1.5 }}>
          {currentExercise.formTip}
        </p>
      </div>

      {/* Swipe nav row */}
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 4px' }}>
        <button
          onClick={(e) => { e.stopPropagation(); if (currentExIndex > 0) { setCurrentExIndex(currentExIndex - 1); setCurrentSet(1); } }}
          disabled={currentExIndex === 0}
          style={{ background: 'none', border: 'none', color: currentExIndex === 0 ? 'transparent' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}
        >
          <ArrowLeftIcon size={12} /> PREV
        </button>

        <span className="spec-label" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
          TAP ANYWHERE = SET COMPLETE
        </span>

        <button
          onClick={(e) => { e.stopPropagation(); if (currentExIndex < workout.exercises.length - 1) { setCurrentExIndex(currentExIndex + 1); setCurrentSet(1); } }}
          disabled={currentExIndex === workout.exercises.length - 1}
          style={{ background: 'none', border: 'none', color: currentExIndex === workout.exercises.length - 1 ? 'transparent' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 600, letterSpacing: '0.1em' }}
        >
          SKIP <ArrowRightIcon size={12} />
        </button>
      </div>

      {/* ── REST TIMER OVERLAY ───────────────────────────────── */}
      {isResting && (
        <div style={{
          position: 'fixed', inset: 0,
          /* Light frosted glass overlay — not dark */
          backgroundColor: 'rgba(244, 247, 252, 0.92)',
          backdropFilter: 'blur(16px)',
          zIndex: 600,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ position: 'relative', width: `${circleSize}px`, height: `${circleSize}px` }}>
            <svg width={circleSize} height={circleSize} style={{ transform: 'rotate(-90deg)' }}>
              {/* Track = cyan tint */}
              <circle cx={circleSize / 2} cy={circleSize / 2} r={radius} fill="none" stroke="var(--color-ice-tint)" strokeWidth={strokeW} />
              {/* Progress: cyan → magenta at last 3s */}
              <circle
                cx={circleSize / 2} cy={circleSize / 2} r={radius}
                fill="none"
                stroke={isWarningLast3s ? 'var(--color-magenta)' : 'var(--color-ice)'}
                strokeWidth={strokeW}
                strokeDasharray={circ}
                strokeDashoffset={restOffset}
                strokeLinecap="round"
                className={isWarningLast3s ? 'animate-rest-warning' : ''}
                style={{
                  transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                  filter: isWarningLast3s
                    ? 'drop-shadow(0 0 12px rgba(224,30,122,0.55))'
                    : 'drop-shadow(0 0 8px rgba(0,144,184,0.4))'
                }}
              />
            </svg>

            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <span className="spec-label" style={{ fontSize: '11px', color: isWarningLast3s ? 'var(--color-magenta)' : 'var(--color-ice)' }}>
                {isWarningLast3s ? 'GRAB THE BAR' : 'RESTING'}
              </span>
              <div className="font-hero tabular-nums" style={{ fontSize: '58px', lineHeight: 1, color: 'var(--text-primary)', marginTop: '4px' }}>
                {restSecondsLeft}s
              </div>
            </div>
          </div>

          <div className="spec-label" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '28px' }}>
            TAP ANYWHERE TO SKIP REST
          </div>
        </div>
      )}

      {/* ── 3-Second Undo Bar ───────────────────────────────── */}
      {undoCountdown !== null && (
        <div style={{
          position: 'fixed',
          bottom: '24px', left: '20px', right: '20px',
          maxWidth: '440px', margin: '0 auto',
          backgroundColor: 'var(--surface-card)',
          border: '1.5px solid var(--color-ember)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          zIndex: 900,
          boxShadow: '0 8px 32px rgba(255,77,0,0.20)'
        }}>
          <div>
            <div className="font-hero" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>PROTOCOL COMPLETE</div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Logging in {undoCountdown}s…</div>
          </div>
          <button
            onClick={handleCancelFinish}
            className="btn-secondary"
            style={{ padding: '8px 14px', fontSize: '11px', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}
          >
            UNDO
          </button>
        </div>
      )}
    </div>
  );
}
