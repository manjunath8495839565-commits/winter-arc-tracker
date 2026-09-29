import React, { useState } from 'react';
import { TrophyIcon, ScaleIcon, CheckIcon, CloseIcon } from './Icons';

export function StatsScreen({
  streakData,
  bodyMetrics,
  onSaveBodyMetric,
  bestRecords,
  onSaveRecord
}) {
  const [showBodyModal, setShowBodyModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);

  // Body metric form state
  const [inputWeight, setInputWeight] = useState('');
  const [inputWaist, setInputWaist] = useState('');
  const [inputPhoto, setInputPhoto] = useState(null);

  // Record modal state
  const [recordKey, setRecordKey] = useState('pushups');
  const [recordVal, setRecordVal] = useState('');

  // Handle Photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInputPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitBodyMetric = (e) => {
    e.preventDefault();
    if (!inputWeight) return;
    const nextWeek = bodyMetrics.length + 1;
    onSaveBodyMetric({
      week: nextWeek,
      date: new Date().toISOString().split('T')[0],
      weight: parseFloat(inputWeight),
      waist: inputWaist ? parseFloat(inputWaist) : null,
      photo: inputPhoto
    });
    setInputWeight('');
    setInputWaist('');
    setInputPhoto(null);
    setShowBodyModal(false);
  };

  const submitRecord = (e) => {
    e.preventDefault();
    if (!recordVal) return;
    onSaveRecord(recordKey, recordVal);
    setRecordVal('');
    setShowRecordModal(false);
  };

  // Sparkline coordinates calculation
  const weightValues = bodyMetrics.map((m) => m.weight);
  const minW = weightValues.length ? Math.min(...weightValues) - 1 : 70;
  const maxW = weightValues.length ? Math.max(...weightValues) + 1 : 85;
  const sparkWidth = 320;
  const sparkHeight = 90;

  const points = weightValues.map((w, i) => {
    const x = weightValues.length > 1
      ? (i / (weightValues.length - 1)) * (sparkWidth - 20) + 10
      : sparkWidth / 2;
    const y = sparkHeight - ((w - minW) / (maxW - minW || 1)) * (sparkHeight - 24) - 12;
    return `${x},${y}`;
  }).join(' ');

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
          WAR STATS
        </h1>
        <p className="spec-label" style={{ color: 'var(--color-ice)' }}>
          DATA NEVER LIES • 90-DAY METRICS
        </p>
      </div>

      {/* 2x2 Grid of Big Stat Blocks */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        marginBottom: '28px'
      }}>
        {/* Block 1: Total Hours Trained */}
        <div className="cold-card" style={{ padding: '20px 16px' }}>
          <div className="spec-label" style={{ fontSize: '11px', marginBottom: '8px' }}>
            HOURS TRAINED
          </div>
          <div className="font-hero tabular-nums" style={{ fontSize: '42px', lineHeight: 1, color: 'var(--text-primary)' }}>
            {streakData.totalHours}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            AT 6:00 AM
          </div>
        </div>

        {/* Block 2: Workouts Done */}
        <div className="cold-card" style={{ padding: '20px 16px' }}>
          <div className="spec-label" style={{ fontSize: '11px', marginBottom: '8px' }}>
            WORKOUTS DONE
          </div>
          <div className="font-hero tabular-nums" style={{ fontSize: '42px', lineHeight: 1, color: 'var(--color-ember)' }}>
            {streakData.totalWorkouts}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            OF 90 BATTLES
          </div>
        </div>

        {/* Block 3: Longest Streak */}
        <div className="cold-card" style={{ padding: '20px 16px' }}>
          <div className="spec-label" style={{ fontSize: '11px', marginBottom: '8px' }}>
            LONGEST STREAK
          </div>
          <div className="font-hero tabular-nums" style={{ fontSize: '42px', lineHeight: 1, color: 'var(--text-primary)' }}>
            {streakData.longestStreak}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            DAYS CONSECUTIVE
          </div>
        </div>

        {/* Block 4: Current Streak */}
        <div className="cold-card" style={{ padding: '20px 16px' }}>
          <div className="spec-label" style={{ fontSize: '11px', marginBottom: '8px' }}>
            CURRENT STREAK
          </div>
          <div className="font-hero tabular-nums" style={{ fontSize: '42px', lineHeight: 1, color: 'var(--color-ice)' }}>
            {streakData.currentStreak}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
            ACTIVE CHAIN
          </div>
        </div>
      </div>

      {/* Body Weight Trend & Sparkline (Pure SVG in Ice Blue, No Library) */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div>
            <div className="spec-label" style={{ color: 'var(--color-ice)' }}>
              WEEKLY BODYWEIGHT SPARKLINE
            </div>
            <div className="font-hero tabular-nums" style={{ fontSize: '24px', color: 'var(--text-primary)', marginTop: '2px' }}>
              {weightValues[weightValues.length - 1] || '--'} KG
            </div>
          </div>

          <button
            onClick={() => setShowBodyModal(true)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            + LOG SUNDAY
          </button>
        </div>

        {/* SVG Sparkline */}
        <div style={{ width: '100%', height: `${sparkHeight}px`, overflow: 'hidden' }}>
          <svg width="100%" height={sparkHeight} viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} preserveAspectRatio="none">
            {/* Guide line */}
            <line x1="0" y1={sparkHeight / 2} x2={sparkWidth} y2={sparkHeight / 2} stroke="var(--border-subtle)" strokeDasharray="3,3" />

            {/* Sparkline polyline */}
            {weightValues.length > 1 ? (
              <>
                <polyline
                  fill="none"
                  stroke="var(--color-ice)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={points}
                  style={{ filter: 'drop-shadow(0 0 6px var(--glow-ice))' }}
                />
                {/* Data Points */}
                {weightValues.map((w, idx) => {
                  const [px, py] = points.split(' ')[idx].split(',');
                  return (
                    <circle
                      key={idx}
                      cx={px}
                      cy={py}
                      r="4"
                      fill="#0A0C10"
                      stroke="var(--color-ice)"
                      strokeWidth="2"
                    />
                  );
                })}
              </>
            ) : (
              <text x={sparkWidth / 2} y={sparkHeight / 2} fill="var(--text-muted)" fontSize="12" textAnchor="middle">
                Log weekly Sunday weight to plot trend
              </text>
            )}
          </svg>
        </div>

        {/* Metric History entries preview */}
        {bodyMetrics.length > 0 && (
          <div style={{ marginTop: '12px', display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {bodyMetrics.map((m) => (
              <div
                key={m.week}
                style={{
                  backgroundColor: 'rgba(30, 35, 46, 0.4)',
                  padding: '6px 10px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '11px',
                  flexShrink: 0
                }}
              >
                <div style={{ color: 'var(--text-secondary)' }}>W{m.week}</div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{m.weight} kg</div>
                {m.waist && <div style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{m.waist} cm</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Beat-Your-Best Board */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrophyIcon size={18} color="var(--color-ember)" />
            <span className="spec-label" style={{ color: 'var(--color-ember)' }}>
              BEAT-YOUR-BEST BOARD
            </span>
          </div>

          <button
            onClick={() => setShowRecordModal(true)}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '11px' }}
          >
            UPDATE RECORD
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Max Push-ups */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 14px',
            backgroundColor: 'rgba(30, 35, 46, 0.3)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--color-ember)'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                MAX UNBROKEN PUSH-UPS
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Recorded: {bestRecords.pushups?.date || 'Week 4 Test'}
              </div>
            </div>
            <div className="font-hero tabular-nums" style={{ fontSize: '24px', color: 'var(--color-ember)' }}>
              {bestRecords.pushups?.value} REPS
            </div>
          </div>

          {/* Longest Plank */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 14px',
            backgroundColor: 'rgba(30, 35, 46, 0.3)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--color-ice)'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                LONGEST FOREARM PLANK
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Recorded: {bestRecords.plank?.date || 'Week 8 Test'}
              </div>
            </div>
            <div className="font-hero tabular-nums" style={{ fontSize: '24px', color: 'var(--color-ice)' }}>
              {bestRecords.plank?.value} SEC
            </div>
          </div>

          {/* Fastest 5K */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '12px 14px',
            backgroundColor: 'rgba(30, 35, 46, 0.3)',
            borderRadius: 'var(--radius-sm)',
            borderLeft: '3px solid var(--text-primary)'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                FASTEST 5K (3.1 MILES)
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Recorded: {bestRecords.run5k?.date || 'Week 12 Test'}
              </div>
            </div>
            <div className="font-hero tabular-nums" style={{ fontSize: '24px', color: 'var(--text-primary)' }}>
              {bestRecords.run5k?.value}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Log Weekly Body Metrics */}
      {showBodyModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 800
        }}>
          <form onSubmit={submitBodyMetric} className="cold-card" style={{ maxWidth: '380px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="spec-label" style={{ color: 'var(--color-ice)' }}>
                SUNDAY CHECK-IN
              </span>
              <button
                type="button"
                onClick={() => setShowBodyModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <h3 className="font-hero" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              LOG BODY METRICS
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <label className="spec-label" style={{ display: 'block', marginBottom: '6px' }}>
                WEIGHT (KG) *
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
                placeholder="e.g. 77.2"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0A0C10',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label className="spec-label" style={{ display: 'block', marginBottom: '6px' }}>
                WAIST SIZE (CM) (OPTIONAL)
              </label>
              <input
                type="number"
                step="0.5"
                value={inputWaist}
                onChange={(e) => setInputWaist(e.target.value)}
                placeholder="e.g. 82.5"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0A0C10',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="spec-label" style={{ display: 'block', marginBottom: '6px' }}>
                LOCAL PROGRESS PHOTO (OPTIONAL)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)'
                }}
              />
              {inputPhoto && (
                <div style={{ marginTop: '8px' }}>
                  <img src={inputPhoto} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-subtle)' }} />
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary-ember" style={{ padding: '12px', fontSize: '13px' }}>
                SAVE METRICS
              </button>
              <button type="button" onClick={() => setShowBodyModal(false)} className="btn-secondary" style={{ padding: '12px', fontSize: '13px' }}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal: Update Beat-Your-Best Record */}
      {showRecordModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 800
        }}>
          <form onSubmit={submitRecord} className="cold-card" style={{ maxWidth: '380px', width: '100%', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span className="spec-label" style={{ color: 'var(--color-ember)' }}>
                WARRIOR PR
              </span>
              <button
                type="button"
                onClick={() => setShowRecordModal(false)}
                style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
              >
                <CloseIcon size={20} />
              </button>
            </div>

            <h3 className="font-hero" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '16px' }}>
              RECORD NEW BEST
            </h3>

            <div style={{ marginBottom: '14px' }}>
              <label className="spec-label" style={{ display: 'block', marginBottom: '6px' }}>
                TEST DISCIPLINE
              </label>
              <select
                value={recordKey}
                onChange={(e) => setRecordKey(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0A0C10',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '14px'
                }}
              >
                <option value="pushups">Max Push-ups (Reps)</option>
                <option value="plank">Longest Plank (Seconds)</option>
                <option value="run5k">Fastest 5K (MM:SS)</option>
              </select>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label className="spec-label" style={{ display: 'block', marginBottom: '6px' }}>
                NEW RECORD VALUE
              </label>
              <input
                type="text"
                required
                value={recordVal}
                onChange={(e) => setRecordVal(e.target.value)}
                placeholder={recordKey === 'run5k' ? 'e.g. 21:15' : 'e.g. 52'}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#0A0C10',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-sm)',
                  color: 'var(--text-primary)',
                  fontSize: '15px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-primary-ember" style={{ padding: '12px', fontSize: '13px' }}>
                CLAIM RECORD
              </button>
              <button type="button" onClick={() => setShowRecordModal(false)} className="btn-secondary" style={{ padding: '12px', fontSize: '13px' }}>
                CANCEL
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
