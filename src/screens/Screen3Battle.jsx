import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '../components/Icons';
import {
  playSetCompleteSound,
  playRestEndSound,
  playTimerTickSound
} from '../utils/audio';

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

  // Rest Timer State
  const [isResting, setIsResting] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(restTimerConfig);

  // Tap ripple effect
  const [ripplePos, setRipplePos] = useState(null);

  // Implicit finish countdown (3-second undo bar)
  const [undoCountdown, setUndoCountdown] = useState(null);

  // Touch gesture tracking for swipe left / swipe right
  const touchStartXRef = useRef(null);
  const sessionTimerRef = useRef(null);
  const restTimerRef = useRef(null);
  const undoTimerRef = useRef(null);

  const currentExercise = workout.exercises[currentExIndex] || workout.exercises[0];
  const totalSets = currentExercise?.sets || 4;
  const isFinalExercise = currentExIndex === workout.exercises.length - 1;
  const isFinalSet = currentSet === totalSets;

  // Session elapsed timer (out of 60 mins / 3600 seconds)
  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);

  // Rest Timer loop
  useEffect(() => {
    if (isResting) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsLeft((prev) => {
          // Last 3 seconds warning tick
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playTimerTickSound();
          }
          if (prev <= 1) {
            if (soundEnabled) playRestEndSound();
            setIsResting(false);
            return restTimerConfig;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    }

    return () => {
      if (restTimerRef.current) clearInterval(restTimerRef.current);
    };
  }, [isResting, restTimerConfig, soundEnabled]);

  // Handle set completion via tap
  const handleTapScreen = (e) => {
    // If resting, a tap skips rest timer immediately
    if (isResting) {
      setIsResting(false);
      if (soundEnabled) playRestEndSound();
      return;
    }

    // If currently in undo completion countdown, ignore
    if (undoCountdown !== null) return;

    // Trigger tap ripple
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 70;
    const y = e.clientY - rect.top - 70;
    setRipplePos({ x, y });
    setTimeout(() => setRipplePos(null), 250);

    // Audio & Haptic feedback
    if (soundEnabled) {
      playSetCompleteSound();
    }

    // Check if finished entire protocol
    if (isFinalExercise && isFinalSet) {
      // Trigger 3s undo countdown before implicit logging
      triggerImplicitFinish();
      return;
    }

    // Advance set or exercise
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      setRestSecondsLeft(restTimerConfig);
      setIsResting(true);
    } else {
      // Move to next exercise
      setCurrentExIndex(currentExIndex + 1);
      setCurrentSet(1);
      setRestSecondsLeft(restTimerConfig);
      setIsResting(true);
    }
  };

  // 3-Second Undo Bar before implicit lock
  const triggerImplicitFinish = () => {
    setUndoCountdown(3);
  };

  useEffect(() => {
    if (undoCountdown === null) return;
    if (undoCountdown > 0) {
      undoTimerRef.current = setTimeout(() => {
        setUndoCountdown(undoCountdown - 1);
      }, 1000);
    } else {
      // Locked in: Finish workout and transition to Screen 4 (DEBRIEF)
      onCompleteWorkout({
        duration: sessionSeconds,
        setsDone: workout.exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0),
        exercisesCount: workout.exercises.length
      });
    }

    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, [undoCountdown, sessionSeconds, workout, onCompleteWorkout]);

  const handleCancelFinish = (e) => {
    e.stopPropagation();
    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    setUndoCountdown(null);
  };

  // Swipe Gestures
  const handleTouchStart = (e) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaX = touchEndX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (deltaX < -50) {
      // Swipe Left = Skip Exercise
      if (currentExIndex < workout.exercises.length - 1) {
        setCurrentExIndex(currentExIndex + 1);
        setCurrentSet(1);
        setIsResting(false);
      }
    } else if (deltaX > 50) {
      // Swipe Right = Previous Exercise
      if (currentExIndex > 0) {
        setCurrentExIndex(currentExIndex - 1);
        setCurrentSet(1);
        setIsResting(false);
      }
    }
  };

  // Calculate session elapsed percent (out of 60 min = 3600s)
  const sessionProgressPct = Math.min(100, (sessionSeconds / 3600) * 100);

  // Rest Timer Circle calculation
  const circleSize = 220;
  const strokeW = 4;
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
        position: 'fixed',
        inset: 0,
        backgroundColor: '#000000', // Dead black per spec
        zIndex: 500,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px calc(24px + env(safe-area-inset-bottom, 12px)) 24px',
        maxWidth: 'var(--max-width)',
        margin: '0 auto',
        overflow: 'hidden',
        userSelect: 'none',
        cursor: 'pointer'
      }}
    >
      {/* Persistent Micro-Bar at Very Top: Thin ember line (elapsed / 60 min) */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '3px',
        backgroundColor: 'rgba(30, 35, 46, 0.5)',
        zIndex: 10
      }}>
        <div style={{
          width: `${sessionProgressPct}%`,
          height: '100%',
          backgroundColor: 'var(--color-ember)',
          boxShadow: '0 0 10px var(--color-ember)',
          transition: 'width 1s linear'
        }} />
      </div>

      {/* Ripple Animation if tapped */}
      {ripplePos && (
        <div
          className="animate-tap-ripple"
          style={{ top: ripplePos.y, left: ripplePos.x }}
        />
      )}

      {/* Top Header Strip: Exercise Index & Session Clock */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 'calc(16px + env(safe-area-inset-top, 8px))'
      }}>
        <div className="spec-label" style={{ color: 'var(--text-muted)' }}>
          EXERCISE {currentExIndex + 1} / {workout.exercises.length}
        </div>

        <div className="font-hero tabular-nums" style={{ fontSize: '13px', color: 'var(--color-ice)' }}>
          {Math.floor(sessionSeconds / 60)}:{String(sessionSeconds % 60).padStart(2, '0')}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); onExitWorkout(); }}
          className="btn-ghost-weak"
          style={{ padding: '4px', fontSize: '11px', textDecoration: 'none' }}
        >
          EXIT
        </button>
      </div>

      {/* Center Layout: ONE exercise at a time, zero scrolling */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1
      }}>
        {/* Exercise Name Huge (Archivo Black 34px) */}
        <h1
          className="font-hero"
          style={{
            fontSize: '32px',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            textTransform: 'uppercase',
            maxWidth: '380px',
            marginBottom: '8px'
          }}
        >
          {currentExercise.name}
        </h1>

        {/* Target Muscle Small Steel Caps Under It */}
        <div
          className="spec-label"
          style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: 'var(--text-secondary)',
            marginBottom: '44px'
          }}
        >
          {currentExercise.target}
        </div>

        {/* Center: "SET 2/4" + "REPS 10" as Giant Ice-Blue Numerals */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '40px',
          marginBottom: '32px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spec-label" style={{ fontSize: '11px', marginBottom: '4px' }}>
              SET
            </div>
            <div
              className="font-hero tabular-nums"
              style={{
                fontSize: '52px',
                lineHeight: 1,
                color: 'var(--color-ice)',
                textShadow: '0 0 20px var(--glow-ice)'
              }}
            >
              {currentSet}/{totalSets}
            </div>
          </div>

          <div style={{ width: '1px', height: '60px', backgroundColor: 'var(--border-subtle)' }} />

          <div style={{ textAlign: 'center' }}>
            <div className="spec-label" style={{ fontSize: '11px', marginBottom: '4px' }}>
              TARGET
            </div>
            <div
              className="font-hero tabular-nums"
              style={{
                fontSize: '52px',
                lineHeight: 1,
                color: 'var(--color-ice)',
                textShadow: '0 0 20px var(--glow-ice)'
              }}
            >
              {currentExercise.reps || currentExercise.displayReps}
            </div>
          </div>
        </div>

        {/* Form cue */}
        <p style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          maxWidth: '320px',
          lineHeight: 1.4,
          opacity: 0.8
        }}>
          {currentExercise.formTip}
        </p>
      </div>

      {/* Swipe Nav Cue & Bottom Spec */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 4px',
        color: 'var(--text-muted)',
        fontSize: '11px'
      }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (currentExIndex > 0) {
              setCurrentExIndex(currentExIndex - 1);
              setCurrentSet(1);
            }
          }}
          disabled={currentExIndex === 0}
          style={{ background: 'none', border: 'none', color: currentExIndex === 0 ? 'transparent' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          <ArrowLeftIcon size={12} /> PREV
        </button>

        <span className="spec-label" style={{ fontSize: '9px', color: 'var(--text-muted)' }}>
          TAP ANYWHERE = SET COMPLETE
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            if (currentExIndex < workout.exercises.length - 1) {
              setCurrentExIndex(currentExIndex + 1);
              setCurrentSet(1);
            }
          }}
          disabled={currentExIndex === workout.exercises.length - 1}
          style={{ background: 'none', border: 'none', color: currentExIndex === workout.exercises.length - 1 ? 'transparent' : 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          SKIP <ArrowRightIcon size={12} />
        </button>
      </div>

      {/* REST TIMER OVERLAY (Auto-triggered after set completion) */}
      {isResting && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.94)',
          backdropFilter: 'blur(12px)',
          zIndex: 600,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <div style={{ position: 'relative', width: `${circleSize}px`, height: `${circleSize}px` }}>
            <svg width={circleSize} height={circleSize} style={{ transform: 'rotate(-90deg)' }}>
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke="#161A23"
                strokeWidth={strokeW}
              />
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke={isWarningLast3s ? 'var(--color-ember)' : 'var(--color-ice)'}
                strokeWidth={strokeW}
                strokeDasharray={circ}
                strokeDashoffset={restOffset}
                strokeLinecap="round"
                className={isWarningLast3s ? 'animate-rest-warning' : ''}
                style={{
                  transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                  filter: isWarningLast3s ? 'drop-shadow(0 0 12px var(--color-ember))' : 'drop-shadow(0 0 8px var(--glow-ice))'
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
              <span className="spec-label" style={{ fontSize: '11px', color: isWarningLast3s ? 'var(--color-ember)' : 'var(--color-ice)' }}>
                {isWarningLast3s ? 'GRAB THE BAR' : 'RESTING'}
              </span>
              <div
                className="font-hero tabular-nums"
                style={{
                  fontSize: '56px',
                  lineHeight: 1,
                  color: 'var(--text-primary)',
                  marginTop: '4px'
                }}
              >
                {restSecondsLeft}s
              </div>
            </div>
          </div>

          <div className="spec-label" style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '28px' }}>
            TAP ANYWHERE TO SKIP REST
          </div>
        </div>
      )}

      {/* 3-Second Undo Bar upon finishing last set of protocol */}
      {undoCountdown !== null && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          left: '20px',
          right: '20px',
          maxWidth: '440px',
          margin: '0 auto',
          backgroundColor: '#161A23',
          border: '1px solid var(--color-ember)',
          borderRadius: 'var(--radius-md)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 900,
          boxShadow: '0 0 30px var(--glow-ember-intense)'
        }}>
          <div>
            <div className="font-hero" style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
              PROTOCOL COMPLETE
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Logging in {undoCountdown}s...
            </div>
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
