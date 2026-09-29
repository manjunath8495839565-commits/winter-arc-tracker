import React from 'react';
import { ShuffleIcon } from './Icons';

export function QuoteBlock({ quote, onShuffle }) {
  if (!quote) return null;

  return (
    <div style={{
      width: '100%',
      padding: '24px 20px',
      margin: '36px 0 20px 0',
      borderTop: '1px solid var(--border-subtle)',
      borderBottom: '1px solid var(--border-subtle)',
      position: 'relative',
      textAlign: 'center'
    }}>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontStyle: 'italic',
        fontSize: '18px',
        lineHeight: 1.6,
        color: 'var(--text-primary)',
        opacity: 0.75,
        maxWidth: '400px',
        margin: '0 auto',
        wordBreak: 'break-word'
      }}>
        "{quote.text}"
      </p>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '12px'
      }}>
        <span className="spec-label" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
          — {quote.author.toUpperCase()}
        </span>

        <button
          onClick={onShuffle}
          title="Shuffle Warrior Quote"
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            padding: '4px',
            borderRadius: '4px',
            fontSize: '10px',
            fontFamily: 'var(--font-body)',
            opacity: 0.8,
            transition: 'opacity 0.15s ease, color 0.15s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-ember)'; e.currentTarget.style.opacity = '1'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.opacity = '0.8'; }}
        >
          <ShuffleIcon size={12} />
        </button>
      </div>
    </div>
  );
}
