import React from 'react';
import { FlameIcon, CalendarIcon, StatsIcon, GearIcon } from './Icons';

export function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', icon: FlameIcon, label: 'Home' },
    { id: 'plan', icon: CalendarIcon, label: 'Plan / Heatmap' },
    { id: 'stats', icon: StatsIcon, label: 'Stats' },
    { id: 'settings', icon: GearIcon, label: 'Settings' }
  ];

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: 'var(--max-width)',
      height: '64px',
      backgroundColor: 'rgba(10, 12, 16, 0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      zIndex: 100
    }}>
      {tabs.map((tab) => {
        const IconComponent = tab.icon;
        const isActive = activeTab === tab.id;
        const color = isActive ? 'var(--color-ember)' : 'var(--text-secondary)';

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            aria-label={tab.label}
            style={{
              background: 'none',
              border: 'none',
              color: color,
              padding: '12px 24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              transition: 'color 0.15s ease, transform 0.15s ease'
            }}
          >
            <IconComponent size={24} color={color} />
            {isActive && (
              <span style={{
                position: 'absolute',
                top: 0,
                width: '16px',
                height: '2px',
                backgroundColor: 'var(--color-ember)',
                boxShadow: '0 0 8px var(--color-ember)'
              }} />
            )}
          </button>
        );
      })}
    </nav>
  );
}
