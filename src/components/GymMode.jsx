import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, CloseIcon, PlayIcon, PauseIcon } from './Icons';
import { playTimerAlertSound, playTimerTickSound } from '../utils/audio';

export function GymMode({
  workout,
  arcDay,
  onCompleteWorkout,
  onCloseGym,
  restTimerConfig = 60,
  soundEnabled = true
}) {
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [sessionSeconds, setSessionSeconds] = useState(0);
  const [completedExercises, setCompletedExercises] = useState([]);

  // Rest Timer State
  const [restSecondsLeft, setRestSecondsLeft] = useState(restTimerConfig);
  const [isResting, setIsResting] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const restTimerRef = useRef(null);
  const sessionTimerRef = useRef(null);

  const currentExercise = workout.exercises[currentExIndex] || workout.exercises[0];
  const totalSets = currentExercise?.sets || 3;
  const nextExercise = workout.exercises[currentExIndex + 1];

  // Session stopwatch
  useEffect(() => {
    sessionTimerRef.current = setInterval(() => {
      setSessionSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      if (sessionTimerRef.current) clearInterval(sessionTimerRef.current);
    };
  }, []);

  // Rest Timer countdown
  useEffect(() => {
    if (isResting) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 4 && prev > 1 && soundEnabled) {
            playTimerTickSound();
          }
          if (prev <= 1) {
            if (soundEnabled) playTimerAlertSound();
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

  const toggleRestTimer = () => {
    if (!isResting && restSecondsLeft === 0) {
      setRestSecondsLeft(restTimerConfig);
    }
    setIsResting(!isResting);
  };

  const handleNextSet = () => {
    if (currentSet < totalSets) {
      setCurrentSet(currentSet + 1);
      // Automatically trigger rest timer between sets
      setRestSecondsLeft(restTimerConfig);
      setIsResting(true);
    } else {
      // Mark current exercise as complete and advance
      if (!completedExercises.includes(currentExercise.id)) {
        setCompletedExercises([...completedExercises, currentExercise.id]);
      }
      if (currentExIndex < workout.exercises.length - 1) {
        setCurrentExIndex(currentExIndex + 1);
        setCurrentSet(1);
        setRestSecondsLeft(restTimerConfig);
        setIsResting(true);
      }
    }
  };

  const handlePrevExercise = () => {
    if (currentExIndex > 0) {
      setCurrentExIndex(currentExIndex - 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  const handleNextExercise = () => {
    if (currentExIndex < workout.exercises.length - 1) {
      if (!completedExercises.includes(currentExercise.id)) {
        setCompletedExercises([...completedExercises, currentExercise.id]);
      }
      setCurrentExIndex(currentExIndex + 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  // Format MM:SS
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // 45 min lock rule (2700 seconds)
  // We allow "Finish Early (Weak Move)" as explicitly specified in Part 6
  const is45MinReached = sessionSeconds >= 2700;
  const minutesLeftForUnlock = Math.max(0, Math.ceil((2700 - sessionSeconds) / 60));

  // Rest Timer Circle calculation
  const circleSize = 140;
  const strokeW = 4;
  const radius = (circleSize - strokeW * 2) / 2;
  const circ = 2 * Math.PI * radius;
  const restRatio = restSecondsLeft / restTimerConfig;
  const restOffset = circ - restRatio * circ;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: '#000000', // Full black per spec
      zIndex: 500,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      maxWidth: 'var(--max-width)',
      margin: '0 auto',
      padding: '20px 24px calc(24px + env(safe-area-inset-bottom, 0px)) 24px',
      userSelect: 'none'
    }}>
      {/* Top Session Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>
        <button
          onClick={() => setShowExitConfirm(true)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '4px'
          }}
        >
          <CloseIcon size={24} />
        </button>

        <div style={{ textAlign: 'center' }}>
          <div className="spec-label" style={{ fontSize: '10px', color: 'var(--color-ice)' }}>
            GYM MODE • DAY {arcDay}
          </div>
          <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
            {formatTime(sessionSeconds)}
          </div>
        </div>

        <div style={{
          fontSize: '11px',
          fontFamily: 'var(--font-hero)',
          color: 'var(--text-secondary)'
        }}>
          EX {currentExIndex + 1}/{workout.exercises.length}
        </div>
      </div>

      {/* Center Hero Block: Giant Current Exercise & Numbers */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        flex: 1,
        padding: '16px 0'
      }}>
        {/* Muscle spec label */}
        <span className="spec-label" style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
          {currentExercise.target.toUpperCase()}
        </span>

        {/* GIANT Current Exercise Name (Archivo Black 36-40px) */}
        <h1
          className="font-hero"
          style={{
            fontSize: '34px',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: '20px',
            maxWidth: '380px',
            textTransform: 'uppercase'
          }}
        >
          {currentExercise.name}
        </h1>

        {/* Huge Ice-Blue Numbers: SET X/Y and REPS */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '32px',
          marginBottom: '28px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="spec-label" style={{ fontSize: '10px' }}>CURRENT SET</div>
            <div className="font-hero tabular-nums" style={{ fontSize: '38px', color: 'var(--color-ice)', lineHeight: 1 }}>
              {currentSet}/{totalSets}
            </div>
          </div>
          <div style={{ width: '1px', height: '40px', backgroundColor: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div className="spec-label" style={{ fontSize: '10px' }}>TARGET</div>
            <div className="font-hero tabular-nums" style={{ fontSize: '38px', color: 'var(--color-ice)', lineHeight: 1 }}>
              {currentExercise.displayReps || `${currentExercise.reps} REPS`}
            </div>
          </div>
        </div>

        {/* Huge Circular Rest Timer (Tap anywhere to start/stop) */}
        <div
          onClick={toggleRestTimer}
          style={{
            position: 'relative',
            width: `${circleSize}px`,
            height: `${circleSize}px`,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}
          title="Tap to Start / Stop Rest Timer"
        >
          <svg
            width={circleSize}
            height={circleSize}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: 'rotate(-90deg)'
            }}
          >
            {/* Background track */}
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="none"
              stroke="#161A23"
              strokeWidth={strokeW}
            />
            {/* Depleting Ice Blue Ring */}
            <circle
              cx={circleSize / 2}
              cy={circleSize / 2}
              r={radius}
              fill="none"
              stroke="var(--color-ice)"
              strokeWidth={strokeW}
              strokeDasharray={circ}
              strokeDashoffset={restOffset}
              strokeLinecap="round"
              style={{
                transition: isResting ? 'stroke-dashoffset 1s linear' : 'none',
                filter: 'drop-shadow(0 0 6px var(--glow-ice))'
              }}
            />
          </svg>

          <div style={{ textAlign: 'center', zIndex: 2 }}>
            <div className="spec-label" style={{ fontSize: '9px', color: isResting ? 'var(--color-ice)' : 'var(--text-secondary)' }}>
              {isResting ? 'RESTING' : 'REST TIMER'}
            </div>
            <div className="font-hero tabular-nums" style={{ fontSize: '30px', color: 'var(--text-primary)', lineHeight: 1 }}>
              {restSecondsLeft}s
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
              TAP TO {isResting ? 'PAUSE' : 'START'}
            </div>
          </div>
        </div>

        {/* Form Tip */}
        <div style={{
          backgroundColor: 'rgba(18, 21, 28, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          maxWidth: '360px',
          fontSize: '12px',
          color: 'var(--text-secondary)',
          lineHeight: 1.4
        }}>
          <strong style={{ color: 'var(--text-primary)' }}>FORM: </strong> {currentExercise.formTip}
        </div>
      </div>

      {/* Bottom Area: Controls & Complete Trigger */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
        {/* Next Exercise Strip */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4px',
          fontSize: '12px',
          color: 'var(--text-secondary)'
        }}>
          <button
            onClick={handlePrevExercise}
            disabled={currentExIndex === 0}
            style={{
              background: 'none',
              border: 'none',
              color: currentExIndex === 0 ? 'var(--text-muted)' : 'var(--text-secondary)',
              cursor: currentExIndex === 0 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <ArrowLeftIcon size={14} /> PREV
          </button>

          <span style={{ color: 'var(--text-muted)', fontSize: '11px', textAlign: 'center' }}>
            {nextExercise ? `NEXT -> ${nextExercise.name} (${nextExercise.sets}x${nextExercise.reps || nextExercise.displayReps})` : 'FINAL EXERCISE'}
          </span>

          <button
            onClick={handleNextExercise}
            disabled={currentExIndex === workout.exercises.length - 1}
            style={{
              background: 'none',
              border: 'none',
              color: currentExIndex === workout.exercises.length - 1 ? 'var(--text-muted)' : 'var(--text-secondary)',
              cursor: currentExIndex === workout.exercises.length - 1 ? 'default' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            SKIP <ArrowRightIcon size={14} />
          </button>
        </div>

        {/* Set Advance Button */}
        <button
          onClick={handleNextSet}
          className="btn-primary-ember"
          style={{
            padding: '16px',
            fontSize: '15px'
          }}
        >
          {currentSet < totalSets
            ? `COMPLETE SET ${currentSet} / ${totalSets}`
            : currentExIndex < workout.exercises.length - 1
            ? 'EXERCISE FINISHED -> NEXT'
            : 'FINISH ALL EXERCISES'}
        </button>

        {/* MARK COMPLETE Lock Logic (45+ min) */}
        <div style={{ textAlign: 'center', marginTop: '4px' }}>
          {is45MinReached ? (
            <button
              onClick={() => onCompleteWorkout(sessionSeconds)}
              className="btn-primary-ember"
              style={{
                backgroundColor: 'var(--color-success)',
                color: '#0A0C10',
                boxShadow: '0 0 30px var(--glow-success)'
              }}
            >
              <CheckIcon size={20} color="#0A0C10" />
              MARK WORKOUT COMPLETE
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              <button
                disabled
                className="btn-primary-ember"
                style={{ opacity: 0.45 }}
              >
                COMPLETE LOCKED ({minutesLeftForUnlock}M OF 45M REMAINING)
              </button>
              <button
                onClick={() => onCompleteWorkout(sessionSeconds)}
                className="btn-ghost-weak"
              >
                Finish Early (Weak Move)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Exit Modal Confirm */}
      {showExitConfirm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          zIndex: 600
        }}>
          <div className="cold-card" style={{ maxWidth: '360px', width: '100%', textAlign: 'center', padding: '24px' }}>
            <h3 className="font-hero" style={{ fontSize: '20px', marginBottom: '12px', color: 'var(--text-primary)' }}>
              ABANDON THE SESSION?
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px', lineHeight: 1.5 }}>
              The iron was waiting. Leaving now records 0 completion for Day {arcDay}.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button
                onClick={() => setShowExitConfirm(false)}
                className="btn-primary-ember"
                style={{ padding: '14px' }}
              >
                STAY & LIFT
              </button>
              <button
                onClick={() => { setShowExitConfirm(false); onCloseGym(); }}
                className="btn-ghost-weak"
                style={{ color: 'var(--color-danger)' }}
              >
                Quit Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
