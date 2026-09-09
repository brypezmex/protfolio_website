import { useCallback, useEffect, useRef, useState } from 'react';
import { PixelIcon } from './PixelIcon.jsx';
import './CopyField.css';

/**
 * Displays a value with a copy-to-clipboard control.
 *
 * The confirmation is announced through an aria-live region rather than colour
 * alone, so the result is available to screen readers. When the Clipboard API
 * is unavailable (older browsers, non-secure origins) the button is not
 * rendered at all and the value stays selectable as plain text.
 *
 * @param {object} props
 * @param {string} props.label
 * @param {string} props.value
 * @param {string} [props.href] makes the value a link
 * @param {string} [props.glyph]
 */
export function CopyField({ label, value, href, glyph = 'mail' }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  const canCopy =
    typeof navigator !== 'undefined' && Boolean(navigator.clipboard?.writeText);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // A denied clipboard permission is not worth an error state; the value is
      // visible and selectable either way.
    }
  }, [value]);

  return (
    <div className="copy-field notched--sm">
      <PixelIcon name={glyph} size={16} className="copy-field__glyph" />

      <div className="copy-field__body">
        <span className="copy-field__label label">{label}</span>
        {href ? (
          <a
            className="copy-field__value"
            href={href}
            {...(href.startsWith('http')
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : null)}
          >
            {value}
          </a>
        ) : (
          <span className="copy-field__value">{value}</span>
        )}
      </div>

      {canCopy ? (
        <button
          className="copy-field__button"
          type="button"
          onClick={onCopy}
          aria-label={`Copy ${label.toLowerCase()}`}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      ) : null}

      <span className="sr-only" role="status">
        {copied ? `${label} copied to clipboard` : ''}
      </span>
    </div>
  );
}

export default CopyField;
