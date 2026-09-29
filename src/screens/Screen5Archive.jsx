import React, { useState } from 'react';
import { ArrowLeftIcon, TrophyIcon, ShieldIcon, InstallIcon, CloseIcon } from '../components/Icons';
import { getWorkoutForDay } from '../data/workoutPlan';
import { exportArcData, importArcData, clearAllArcData } from '../utils/storage';

export function Screen5Archive({
  arcDay,
  logs,
  streakData,
  bodyMetrics,
  bestRecords,
  settings,
  onSaveBodyMetric,
  onSaveRecord,
  onUpdateSettings,
  onSimulateDay,
  onToggleDayStatus,
  onTriggerResetScreen,
  onBackToVigil,
  canInstall,
  onInstallClick
}) {
  const [activeTab, setActiveTab] = useState('heatmap'); // 'heatmap' | 'stats' | 'plan' | 'settings'
  const [selectedDayPreview, setSelectedDayPreview] = useState(null);
  const [showBodyModal, setShowBodyModal] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);
  const [resetConfirmStep, setResetConfirmStep] = useState(0);

  // Body metric form inputs
  const [inputWeight, setInputWeight] = useState('');
  const [inputWaist, setInputWaist] = useState('');
  const [inputPhoto, setInputPhoto] = useState(null);

  // Record modal inputs
  const [recordKey, setRecordKey] = useState('pushups');
  const [recordVal, setRecordVal] = useState('');

  // 90 Day array for Heatmap
  const daysArray = Array.from({ length: 90 }, (_, i) => i + 1);

  const getDayStatus = (d) => {
    const isCompleted = Boolean(logs[d] && logs[d].completionTimestamp);
    const isToday = d === arcDay;
    const isPast = d < arcDay;
    if (isCompleted) return 'completed';
    if (isToday) return 'today';
    if (isPast) return 'missed';
    return 'future';
  };

  const submitBodyMetric = (e) => {
    e.preventDefault();
    if (!inputWeight) return;
    onSaveBodyMetric({
      week: bodyMetrics.length + 1,
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

  // Sparkline coordinates
  const weightValues = bodyMetrics.map((m) => m.weight);
  const minW = weightValues.length ? Math.min(...weightValues) - 1 : 70;
  const maxW = weightValues.length ? Math.max(...weightValues) + 1 : 85;
  const sparkWidth = 320;
  const sparkHeight = 80;

  const points = weightValues.map((w, i) => {
    const x = weightValues.length > 1
      ? (i / (weightValues.length - 1)) * (sparkWidth - 20) + 10
      : sparkWidth / 2;
    const y = sparkHeight - ((w - minW) / (maxW - minW || 1)) * (sparkHeight - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: 'var(--bg-deep)',
      position: 'relative'
    }}>
      {/* Top Bar: Return to Vigil + App Logo */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-card)',
        boxShadow: '0 1px 0 var(--border-subtle)',
        zIndex: 50
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
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.15em'
          }}
        >
          <ArrowLeftIcon size={16} /> RETURN TO VIGIL
        </button>

        <span className="spec-label" style={{ fontSize: '10px', color: 'var(--color-ice)' }}>
          THE ARCHIVE
        </span>
      </div>

      {/* Sub-Tabs: HEATMAP / STATS / PLAN / SETTINGS */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid var(--border-subtle)',
        backgroundColor: 'var(--surface-card)',
        padding: '0 8px'
      }}>
        {[
          { id: 'heatmap', label: 'HEATMAP' },
          { id: 'stats', label: 'STATS' },
          { id: 'plan', label: 'PLAN' },
          { id: 'settings', label: 'SETTINGS' }
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '14px 4px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid var(--color-ember)' : '2px solid transparent',
                color: isActive ? 'var(--color-ember)' : 'var(--text-secondary)',
                fontFamily: 'var(--font-hero)',
                fontSize: '11px',
                letterSpacing: '0.1em',
                cursor: 'pointer',
                transition: 'color 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT (Single scrollable container) */}
      <div className="archive-scrollable" style={{ padding: '20px' }}>
        {/* TAB 1: HEATMAP */}
        {activeTab === 'heatmap' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <h2 className="font-hero" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
                90 DAYS. 90 BATTLES.
              </h2>
              <p className="spec-label" style={{ fontSize: '10px', color: 'var(--color-ice)' }}>
                LONGEST: {streakData.longestStreak} // CURRENT: {streakData.currentStreak}
              </p>
            </div>

            <div className="cold-card" style={{ padding: '16px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(9, 1fr)',
                gridAutoRows: '34px',
                gap: '4px'
              }}>
                {daysArray.map((d) => {
                  const status = getDayStatus(d);
                  let bg = 'var(--border-subtle)';
                  let color = 'var(--text-muted)';
                  let border = '1px solid transparent';
                  let boxShadow = 'none';

                  if (status === 'completed') {
                    bg = 'var(--color-ember)';
                    color = '#FFFFFF';
                    boxShadow = '0 2px 8px rgba(255,77,0,0.30)';
                  } else if (status === 'missed') {
                    bg = 'var(--color-missed)';
                    color = 'var(--color-danger)';
                  } else if (status === 'today') {
                    bg = 'var(--color-ember-badge)';
                    color = 'var(--color-ember-deep)';
                    border = '1.5px solid var(--color-ember)';
                  }

                  return (
                    <button
                      key={d}
                      onClick={() => setSelectedDayPreview(d)}
                      style={{
                        backgroundColor: bg,
                        color: color,
                        border: border,
                        boxShadow: boxShadow,
                        borderRadius: '3px',
                        fontFamily: 'var(--font-hero)',
                        fontSize: '11px',
                        cursor: 'pointer',
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
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
                fontSize: '10px',
                color: 'var(--text-secondary)',
                marginTop: '16px',
                paddingTop: '10px',
                borderTop: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-ember)', borderRadius: '2px' }} />
                  <span>FORGED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--color-missed)', borderRadius: '2px' }} />
                  <span>MISSED</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', border: '1px solid var(--color-ember)', borderRadius: '2px' }} />
                  <span>TODAY</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ width: '8px', height: '8px', backgroundColor: 'var(--border-subtle)', borderRadius: '2px' }} />
                  <span>FUTURE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STATS */}
        {activeTab === 'stats' && (
          <div>
            {/* 2x2 Big Stat Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              <div className="cold-card" style={{ padding: '16px 12px' }}>
                <div className="spec-label" style={{ fontSize: '10px' }}>HOURS TRAINED</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '38px', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {streakData.totalHours}
                </div>
              </div>
              <div className="cold-card" style={{ padding: '16px 12px' }}>
                <div className="spec-label" style={{ fontSize: '10px' }}>WORKOUTS DONE</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '38px', color: 'var(--color-ember)', marginTop: '4px' }}>
                  {streakData.totalWorkouts}
                </div>
              </div>
              <div className="cold-card" style={{ padding: '16px 12px' }}>
                <div className="spec-label" style={{ fontSize: '10px' }}>LONGEST STREAK</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '38px', color: 'var(--text-primary)', marginTop: '4px' }}>
                  {streakData.longestStreak}
                </div>
              </div>
              <div className="cold-card" style={{ padding: '16px 12px' }}>
                <div className="spec-label" style={{ fontSize: '10px' }}>CURRENT STREAK</div>
                <div className="font-hero tabular-nums" style={{ fontSize: '38px', color: 'var(--color-ice)', marginTop: '4px' }}>
                  {streakData.currentStreak}
                </div>
              </div>
            </div>

            {/* Sunday Weight Sparkline */}
            <div className="cold-card" style={{ padding: '16px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div className="spec-label" style={{ fontSize: '10px', color: 'var(--color-ice)' }}>
                    BODYWEIGHT TREND
                  </div>
                  <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--text-primary)' }}>
                    {weightValues[weightValues.length - 1] || '--'} KG
                  </div>
                </div>
                <button
                  onClick={() => setShowBodyModal(true)}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '10px' }}
                >
                  + SUNDAY CHECK-IN
                </button>
              </div>

              <div style={{ width: '100%', height: `${sparkHeight}px` }}>
                <svg width="100%" height={sparkHeight} viewBox={`0 0 ${sparkWidth} ${sparkHeight}`} preserveAspectRatio="none">
                  <line x1="0" y1={sparkHeight / 2} x2={sparkWidth} y2={sparkHeight / 2} stroke="var(--border-subtle)" strokeDasharray="3,3" />
                  {weightValues.length > 1 ? (
                    <polyline
                      fill="none"
                      stroke="var(--color-ice)"
                      strokeWidth="2.5"
                      points={points}
                      style={{ filter: 'drop-shadow(0 0 6px var(--glow-ice))' }}
                    />
                  ) : (
                    <text x={sparkWidth / 2} y={sparkHeight / 2} fill="var(--text-muted)" fontSize="11" textAnchor="middle">
                      Log weekly Sunday weight to plot trend
                    </text>
                  )}
                </svg>
              </div>
            </div>

            {/* Beat-Your-Best Board */}
            <div className="cold-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <TrophyIcon size={16} color="var(--color-ember)" />
                  <span className="spec-label" style={{ color: 'var(--color-ember)' }}>
                    BEAT-YOUR-BEST LIFTS
                  </span>
                </div>
                <button
                  onClick={() => setShowRecordModal(true)}
                  className="btn-secondary"
                  style={{ padding: '6px 10px', fontSize: '10px' }}
                >
                  UPDATE PR
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {/* VOLT highlight for PRs — rare, max contrast on white */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>MAX PUSH-UPS</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{bestRecords.pushups?.date}</div>
                  </div>
                  <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--color-volt)', background: 'var(--color-volt-tint)', padding: '0 8px', borderRadius: '4px' }}>
                    {bestRecords.pushups?.value} REPS
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>MAX PLANK</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{bestRecords.plank?.date}</div>
                  </div>
                  <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--color-volt)', background: 'var(--color-volt-tint)', padding: '0 8px', borderRadius: '4px' }}>
                    {bestRecords.plank?.value} SEC
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', backgroundColor: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)' }}>FASTEST 5K</div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{bestRecords.run5k?.date}</div>
                  </div>
                  <div className="font-hero tabular-nums" style={{ fontSize: '20px', color: 'var(--color-volt)', background: 'var(--color-volt-tint)', padding: '0 8px', borderRadius: '4px' }}>
                    {bestRecords.run5k?.value}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PLAN (Full 12-week calendar, browsable) */}
        {activeTab === 'plan' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div className="spec-label" style={{ color: 'var(--color-ice)', marginBottom: '4px' }}>
              12-WEEK TRAINING CODEX
            </div>

            {Array.from({ length: 12 }, (_, i) => i + 1).map((weekNum) => {
              const sampleDay = (weekNum - 1) * 7 + 1;
              const isDeload = weekNum === 4 || weekNum === 8 || weekNum === 12;

              return (
                <div key={weekNum} className="cold-card" style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="spec-label" style={{ color: isDeload ? 'var(--color-ember)' : 'var(--text-primary)' }}>
                      WEEK {weekNum} {isDeload ? '// TEST & DELOAD' : '// OVERLOAD +10%'}
                    </span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                      DAYS {(weekNum - 1) * 7 + 1}–{weekNum * 7}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                    {[1, 2, 3, 4, 5, 6, 7].map((offset) => {
                      const d = (weekNum - 1) * 7 + offset;
                      const isCompleted = Boolean(logs[d] && logs[d].completionTimestamp);
                      return (
                        <button
                          key={d}
                          onClick={() => setSelectedDayPreview(d)}
                          style={{
                            padding: '6px 0',
                            backgroundColor: isCompleted ? 'var(--color-ember-badge)' : 'var(--surface-inset)',
                            border: `1px solid ${isCompleted ? 'var(--color-ember)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-sm)',
                            color: isCompleted ? 'var(--color-ember-deep)' : 'var(--text-secondary)',
                            fontFamily: 'var(--font-hero)',
                            fontSize: '10px',
                            cursor: 'pointer'
                          }}
                        >
                          D{d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: SETTINGS */}
        {activeTab === 'settings' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* PWA Install */}
            {canInstall && (
              <div className="cold-card" style={{ padding: '14px', border: '1px solid var(--color-ice)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div className="font-hero" style={{ fontSize: '13px', color: 'var(--text-primary)' }}>
                      INSTALL STANDALONE PWA
                    </div>
                    <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                      Full offline screen access
                    </div>
                  </div>
                  <button
                    onClick={onInstallClick}
                    className="btn-primary-ember"
                    style={{ width: 'auto', padding: '8px 14px', fontSize: '11px', background: 'var(--color-ice)', boxShadow: '0 4px 14px rgba(0,144,184,0.25)' }}
                  >
                    <InstallIcon size={14} color="#FFFFFF" /> INSTALL
                  </button>
                </div>
              </div>
            )}

            {/* Rest Timer */}
            <div className="cold-card" style={{ padding: '16px' }}>
              <div className="spec-label" style={{ marginBottom: '10px' }}>REST TIMER INTERVAL</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                {[30, 45, 60, 90, 120].map((s) => (
                  <button
                    key={s}
                    onClick={() => onUpdateSettings({ ...settings, restTimerDuration: s })}
                    style={{
                      padding: '8px 0',
                      backgroundColor: settings.restTimerDuration === s ? 'var(--color-ice-tint)' : 'var(--surface-inset)',
                      color: settings.restTimerDuration === s ? 'var(--color-ice)' : 'var(--text-secondary)',
                      border: `1px solid ${settings.restTimerDuration === s ? 'var(--color-ice)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-sm)',
                      fontFamily: 'var(--font-hero)',
                      fontSize: '12px',
                      cursor: 'pointer',
                      fontWeight: settings.restTimerDuration === s ? 700 : 400
                    }}
                  >
                    {s}s
                  </button>
                ))}
              </div>
            </div>

            {/* Warrior Save Grace Card */}
            <div className="cold-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldIcon size={16} color="var(--color-ember)" />
                    <span className="spec-label" style={{ color: 'var(--color-ember)' }}>WARRIOR SAVE</span>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    1 emergency missed-day pass protecting streak
                  </div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ ...settings, warriorSaveEnabled: !settings.warriorSaveEnabled })}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px', color: settings.warriorSaveEnabled ? 'var(--color-ember)' : 'var(--text-muted)' }}
                >
                  {settings.warriorSaveEnabled ? 'ARMED' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Sound & Haptics */}
            <div className="cold-card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Soundscapes & SFX</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Bell, anvil, fire, storm, ticks</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled })}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                >
                  {settings.soundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>Tactical Haptics</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Vibrate on sets & rest completion</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled })}
                  className="btn-secondary"
                  style={{ padding: '6px 12px', fontSize: '11px' }}
                >
                  {settings.vibrationEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>

            {/* Backup & Restore */}
            <div className="cold-card" style={{ padding: '16px' }}>
              <div className="spec-label" style={{ marginBottom: '10px' }}>DATA BACKUP</div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={exportArcData} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '11px' }}>
                  SAVE MY ARC
                </button>
                <label className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '11px', textAlign: 'center', cursor: 'pointer' }}>
                  RESTORE
                  <input type="file" accept=".json" onChange={(e) => {
                    const f = e.target.files[0];
                    if (f) {
                      const r = new FileReader();
                      r.onload = (ev) => {
                        if (importArcData(ev.target.result)) window.location.reload();
                      };
                      r.readAsText(f);
                    }
                  }} style={{ display: 'none' }} />
                </label>
              </div>
            </div>

            {/* War Room Simulator Slider */}
            <div className="cold-card" style={{ padding: '16px', border: '1px dashed var(--border-active)' }}>
              <div className="spec-label" style={{ color: 'var(--color-ice)', marginBottom: '8px' }}>
                SIMULATION / TESTING
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <input
                  type="range"
                  min="1"
                  max="90"
                  value={arcDay}
                  onChange={(e) => onSimulateDay(parseInt(e.target.value, 10))}
                  style={{ flex: 1, accentColor: 'var(--color-ember)' }}
                />
                <span className="font-hero tabular-nums" style={{ fontSize: '16px', color: 'var(--color-ember)', width: '56px', textAlign: 'right' }}>
                  D{arcDay}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button onClick={() => onSimulateDay(1)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '10px' }}>D1</button>
                <button onClick={() => onSimulateDay(24)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '10px' }}>D24 Deload</button>
                <button onClick={() => onSimulateDay(90)} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '10px' }}>D90 Final</button>
                <button onClick={onTriggerResetScreen} className="btn-secondary" style={{ padding: '4px 8px', fontSize: '10px', color: 'var(--color-danger)' }}>Test Reset</button>
              </div>
            </div>

            {/* Danger Zone Wipe */}
            <div className="cold-card" style={{ padding: '16px' }}>
              <div className="spec-label" style={{ color: 'var(--color-danger)', marginBottom: '8px' }}>DANGER ZONE</div>
              {resetConfirmStep === 0 && (
                <button onClick={() => setResetConfirmStep(1)} className="btn-danger-outline" style={{ padding: '10px', fontSize: '11px' }}>
                  RESET ALL ARC DATA
                </button>
              )}
              {resetConfirmStep === 1 && (
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--color-danger)', marginBottom: '8px' }}>Discipline has no rewind button. Confirm?</p>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => { clearAllArcData(); window.location.reload(); }} className="btn-danger-outline" style={{ flex: 1, padding: '8px', fontSize: '11px', backgroundColor: 'var(--color-danger)', color: '#FFF' }}>WIPE</button>
                    <button onClick={() => setResetConfirmStep(0)} className="btn-secondary" style={{ flex: 1, padding: '8px', fontSize: '11px' }}>CANCEL</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Day Inspector Popover */}
      {selectedDayPreview && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 18, 32, 0.40)',
          backdropFilter: 'blur(14px)',
          zIndex: 900,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="cold-card" style={{ maxWidth: '380px', width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="spec-label" style={{ color: 'var(--color-ice)' }}>
                DAY {selectedDayPreview} // 90
              </span>
              <button onClick={() => setSelectedDayPreview(null)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <CloseIcon size={18} />
              </button>
            </div>

            <h3 className="font-hero" style={{ fontSize: '18px', color: 'var(--text-primary)', marginBottom: '6px' }}>
              {getWorkoutForDay(selectedDayPreview).title}
            </h3>

            <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Status: <strong style={{ color: getDayStatus(selectedDayPreview) === 'completed' ? 'var(--color-success)' : getDayStatus(selectedDayPreview) === 'missed' ? 'var(--color-danger)' : 'var(--color-ember)' }}>
                {getDayStatus(selectedDayPreview).toUpperCase()}
              </strong>
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => { onToggleDayStatus(selectedDayPreview); setSelectedDayPreview(null); }}
                className="btn-primary-ember"
                style={{ padding: '10px', fontSize: '12px', flex: 1 }}
              >
                {getDayStatus(selectedDayPreview) === 'completed' ? 'UNMARK' : 'MARK FORGED'}
              </button>
              <button
                onClick={() => setSelectedDayPreview(null)}
                className="btn-secondary"
                style={{ padding: '10px', fontSize: '12px', flex: 1 }}
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Body Modal */}
      {showBodyModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11,18,32,0.40)', backdropFilter: 'blur(14px)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={submitBodyMetric} className="cold-card" style={{ maxWidth: '360px', width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="spec-label" style={{ color: 'var(--color-ice)' }}>SUNDAY CHECK-IN</span>
              <button type="button" onClick={() => setShowBodyModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><CloseIcon size={18} /></button>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label className="spec-label" style={{ display: 'block', marginBottom: '4px' }}>WEIGHT (KG) *</label>
              <input type="number" step="0.1" required value={inputWeight} onChange={(e) => setInputWeight(e.target.value)} placeholder="e.g. 78.2" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '14px' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label className="spec-label" style={{ display: 'block', marginBottom: '4px' }}>WAIST (CM) (OPTIONAL)</label>
              <input type="number" step="0.5" value={inputWaist} onChange={(e) => setInputWaist(e.target.value)} placeholder="e.g. 84" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '14px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary-ember" style={{ flex: 1, padding: '10px', fontSize: '12px' }}>SAVE</button>
              <button type="button" onClick={() => setShowBodyModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '12px' }}>CANCEL</button>
            </div>
          </form>
        </div>
      )}

      {/* Record Modal */}
      {showRecordModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(11,18,32,0.40)', backdropFilter: 'blur(14px)', zIndex: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <form onSubmit={submitRecord} className="cold-card" style={{ maxWidth: '360px', width: '100%', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="spec-label" style={{ color: 'var(--color-volt)' }}>RECORD PR</span>
              <button type="button" onClick={() => setShowRecordModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><CloseIcon size={18} /></button>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <select value={recordKey} onChange={(e) => setRecordKey(e.target.value)} style={{ width: '100%', padding: '10px', backgroundColor: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '13px' }}>
                <option value="pushups">Max Push-ups (Reps)</option>
                <option value="plank">Longest Plank (Seconds)</option>
                <option value="run5k">Fastest 5K (MM:SS)</option>
              </select>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <input type="text" required value={recordVal} onChange={(e) => setRecordVal(e.target.value)} placeholder="e.g. 52 or 21:30" style={{ width: '100%', padding: '10px', backgroundColor: 'var(--surface-inset)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)', fontSize: '14px' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" className="btn-primary-ember" style={{ flex: 1, padding: '10px', fontSize: '12px' }}>SAVE PR</button>
              <button type="button" onClick={() => setShowRecordModal(false)} className="btn-secondary" style={{ flex: 1, padding: '10px', fontSize: '12px' }}>CANCEL</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
