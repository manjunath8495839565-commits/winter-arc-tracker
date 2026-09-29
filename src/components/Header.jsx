import React from 'react';
import { GearIcon, InstallIcon } from './Icons';

export function Header({ arcDay, onOpenSettings, onInstallClick, canInstall }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'rgba(10, 12, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span className="spec-label" style={{ color: 'var(--text-secondary)' }}>
          WINTER ARC — DAY {String(arcDay).padStart(2, '0')}/90
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {canInstall && (
          <button
            onClick={onInstallClick}
            title="Install App"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-ice)',
              padding: '4px 8px',
              fontSize: '11px',
              fontFamily: 'var(--font-hero)',
              cursor: 'pointer',
              textTransform: 'uppercase'
            }}
          >
            <InstallIcon size={14} color="var(--color-ice)" />
            INSTALL
          </button>
        )}
        <button
          onClick={onOpenSettings}
          title="Settings"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            borderRadius: '4px',
            transition: 'color 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
        >
          <GearIcon size={20} />
        </button>
      </div>
    </header>
  );
}
