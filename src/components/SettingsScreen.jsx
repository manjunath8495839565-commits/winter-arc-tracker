import React, { useState } from 'react';
import { exportArcData, importArcData, clearAllArcData } from '../utils/storage';
import { ShieldIcon, InstallIcon } from './Icons';

export function SettingsScreen({
  settings,
  onUpdateSettings,
  streakData,
  arcDay,
  onSimulateDay,
  onTriggerResetScreen,
  canInstall,
  onInstallClick
}) {
  const [resetConfirmStep, setResetConfirmStep] = useState(0); // 0 = off, 1 = first confirm, 2 = second confirm
  const [importStatus, setImportStatus] = useState(null);

  const handleRestTimerChange = (val) => {
    onUpdateSettings({ ...settings, restTimerDuration: parseInt(val, 10) });
  };

  const handleWarriorSaveToggle = () => {
    onUpdateSettings({ ...settings, warriorSaveEnabled: !settings.warriorSaveEnabled });
  };

  const handleSoundToggle = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleVibrationToggle = () => {
    onUpdateSettings({ ...settings, vibrationEnabled: !settings.vibrationEnabled });
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = importArcData(event.target.result);
        if (success) {
          setImportStatus('ARC DATA RESTORED. RELOADING...');
          setTimeout(() => window.location.reload(), 800);
        } else {
          setImportStatus('INVALID BACKUP FILE.');
        }
      };
      reader.readAsText(file);
    }
  };

  const executeHardReset = () => {
    clearAllArcData();
    window.location.reload();
  };

  return (
    <div className="page-transition" style={{ padding: '24px 20px', width: '100%' }}>
      {/* Title */}
      <div style={{ marginBottom: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <img
          src="./logo.png"
          alt="Gym Tracker Emblem"
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            objectFit: 'cover',
            border: '2px solid var(--border-active)',
            boxShadow: '0 0 20px rgba(125, 211, 252, 0.25)',
            marginBottom: '12px'
          }}
        />
        <h1
          className="font-hero"
          style={{
            fontSize: '28px',
            color: 'var(--text-primary)',
            letterSpacing: '0.04em',
            marginBottom: '4px'
          }}
        >
          COMMAND & PROTOCOL
        </h1>
        <p className="spec-label" style={{ color: 'var(--color-ice)' }}>
          SYSTEM PREFERENCES • ZERO DRIFT
        </p>
      </div>

      {/* PWA Install Banner if available */}
      {canInstall && (
        <div className="cold-card" style={{ padding: '16px', marginBottom: '20px', border: '1px solid var(--color-ice)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div className="font-hero" style={{ fontSize: '15px', color: 'var(--text-primary)' }}>
                INSTALL WINTER ARC PWA
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                Full-screen offline standalone app on home screen
              </div>
            </div>
            <button
              onClick={onInstallClick}
              className="btn-primary-ember"
              style={{
                width: 'auto',
                padding: '10px 16px',
                fontSize: '12px',
                backgroundColor: 'var(--color-ice)',
                color: '#0A0C10',
                boxShadow: 'none'
              }}
            >
              <InstallIcon size={16} color="#0A0C10" />
              INSTALL
            </button>
          </div>
        </div>
      )}

      {/* Rest Timer Config */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '20px' }}>
        <div className="spec-label" style={{ marginBottom: '12px' }}>
          REST TIMER INTERVAL (BETWEEN SETS)
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {[30, 45, 60, 90, 120].map((sec) => (
            <button
              key={sec}
              onClick={() => handleRestTimerChange(sec)}
              style={{
                padding: '10px 0',
                backgroundColor: settings.restTimerDuration === sec ? 'var(--color-ice)' : '#0A0C10',
                color: settings.restTimerDuration === sec ? '#0A0C10' : 'var(--text-primary)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-hero)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {sec}s
            </button>
          ))}
        </div>
      </div>

      {/* Warrior Save Grace Card */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ paddingRight: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <ShieldIcon size={18} color={settings.warriorSaveEnabled ? 'var(--color-ember)' : 'var(--text-secondary)'} />
              <span className="spec-label" style={{ color: 'var(--color-ember)' }}>
                WARRIOR SAVE (GRACE CARD)
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Allows ONE single missed day throughout the 90 days without resetting your entire streak to zero.
            </p>
            <div style={{ fontSize: '11px', color: settings.warriorSaveUsed ? 'var(--color-danger)' : 'var(--color-success)', marginTop: '6px', fontWeight: 600 }}>
              STATUS: {settings.warriorSaveUsed ? 'ALREADY CONSUMED' : 'ARMED & AVAILABLE'}
            </div>
          </div>

          <button
            onClick={handleWarriorSaveToggle}
            style={{
              padding: '8px 14px',
              backgroundColor: settings.warriorSaveEnabled ? 'rgba(255, 92, 26, 0.15)' : '#0A0C10',
              border: `1px solid ${settings.warriorSaveEnabled ? 'var(--color-ember)' : 'var(--border-subtle)'}`,
              color: settings.warriorSaveEnabled ? 'var(--color-ember)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-hero)',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {settings.warriorSaveEnabled ? 'ENABLED' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Sound & Sensory Switches */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '20px' }}>
        <div className="spec-label" style={{ marginBottom: '14px' }}>
          SENSORY FEEDBACK
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Brutal SFX & Soundscapes
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Sub-bass drop, fire ignition, storm thunder, rest gong
            </div>
          </div>
          <button
            onClick={handleSoundToggle}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px', color: settings.soundEnabled ? 'var(--color-ice)' : 'var(--text-muted)' }}
          >
            {settings.soundEnabled ? 'ON' : 'MUTED'}
          </button>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
              Haptic Vibration Alerts
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Vibrate on timer completion and milestone ticks
            </div>
          </div>
          <button
            onClick={handleVibrationToggle}
            className="btn-secondary"
            style={{ padding: '6px 14px', fontSize: '12px', color: settings.vibrationEnabled ? 'var(--color-ice)' : 'var(--text-muted)' }}
          >
            {settings.vibrationEnabled ? 'ACTIVE' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Backup & Restore (Save My Arc) */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '20px' }}>
        <div className="spec-label" style={{ marginBottom: '12px' }}>
          DATA INTEGRITY & BACKUP
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.5 }}>
          Export your 90-day progress file anytime. 100% client-side, zero cloud tracking.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={exportArcData}
            className="btn-secondary"
            style={{ flex: 1, padding: '12px', fontSize: '12px' }}
          >
            SAVE MY ARC (JSON)
          </button>

          <label
            className="btn-secondary"
            style={{ flex: 1, padding: '12px', fontSize: '12px', textAlign: 'center', cursor: 'pointer' }}
          >
            RESTORE BACKUP
            <input type="file" accept=".json" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>
        </div>
        {importStatus && (
          <div style={{ marginTop: '8px', fontSize: '11px', color: 'var(--color-ice)', textAlign: 'center' }}>
            {importStatus}
          </div>
        )}
      </div>

      {/* TESTING & SIMULATION PANEL (Convenience for testing Days 1-90, Reset, Victory) */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '20px', border: '1px dashed var(--border-active)' }}>
        <div className="spec-label" style={{ color: 'var(--color-ice)', marginBottom: '12px' }}>
          WAR ROOM • TESTING / ARC DAY SIMULATION
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Instantly simulate any day of the 90-day Arc to test progressive overload, Deload weeks, quotes, or reset screen without waiting.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <input
            type="range"
            min="1"
            max="91"
            value={arcDay}
            onChange={(e) => onSimulateDay(parseInt(e.target.value, 10))}
            style={{ flex: 1, accentColor: 'var(--color-ember)' }}
          />
          <span className="font-hero tabular-nums" style={{ fontSize: '18px', color: 'var(--color-ember)', width: '64px', textAlign: 'right' }}>
            DAY {arcDay}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button
            onClick={() => onSimulateDay(1)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            Day 1
          </button>
          <button
            onClick={() => onSimulateDay(24)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            Day 24 (Deload)
          </button>
          <button
            onClick={() => onSimulateDay(45)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            Day 45 (Halfway)
          </button>
          <button
            onClick={() => onSimulateDay(90)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px' }}
          >
            Day 90
          </button>
          <button
            onClick={() => onSimulateDay(null)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--color-ice)' }}
          >
            System Date
          </button>
          <button
            onClick={onTriggerResetScreen}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '11px', color: 'var(--color-danger)' }}
          >
            Test Reset Screen
          </button>
        </div>
      </div>

      {/* Manual Data Reset with Double Confirm Dialog */}
      <div className="cold-card" style={{ padding: '20px 16px', marginBottom: '32px' }}>
        <div className="spec-label" style={{ color: 'var(--color-danger)', marginBottom: '8px' }}>
          DANGER ZONE
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          Wipes all streak logs, records, and preferences permanently.
        </p>

        {resetConfirmStep === 0 && (
          <button
            onClick={() => setResetConfirmStep(1)}
            className="btn-danger-outline"
            style={{ padding: '12px', fontSize: '13px' }}
          >
            RESET ALL ARC DATA
          </button>
        )}

        {resetConfirmStep === 1 && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-danger)' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-danger)', marginBottom: '12px' }}>
              Are you sure? Discipline has no rewind button.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setResetConfirmStep(2)}
                className="btn-danger-outline"
                style={{ flex: 1, padding: '10px', fontSize: '12px', backgroundColor: 'var(--color-danger)', color: '#FFFFFF' }}
              >
                CONFIRM WIPE
              </button>
              <button
                onClick={() => setResetConfirmStep(0)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '12px' }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {resetConfirmStep === 2 && (
          <div style={{ backgroundColor: '#000000', padding: '16px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-danger)', textAlign: 'center' }}>
            <p className="font-hero" style={{ fontSize: '14px', color: 'var(--color-danger)', marginBottom: '14px' }}>
              FINAL CHECK: ALL 90 DAYS WILL BE LOST.
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={executeHardReset}
                className="btn-primary-ember"
                style={{ flex: 1, padding: '10px', fontSize: '12px', backgroundColor: 'var(--color-danger)', color: '#FFFFFF' }}
              >
                ERASE EVERYTHING
              </button>
              <button
                onClick={() => setResetConfirmStep(0)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '12px' }}
              >
                RETREAT
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
