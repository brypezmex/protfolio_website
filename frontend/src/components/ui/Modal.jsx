import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useFocusTrap, useLockBodyScroll } from '../../hooks/useDialog.js';
import { PixelIcon } from './PixelIcon.jsx';
import './Modal.css';

/**
 * Accessible modal dialog rendered into a portal at the document body.
 *
 * Handles the full dialog contract: focus moves in on open and returns to the
 * trigger on close, Tab is trapped, Escape and backdrop clicks close, the page
 * behind is scroll-locked, and the rest of the page is hidden from assistive
 * technology via aria-hidden on the app root.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose
 * @param {string} props.label accessible name for the dialog
 */
export function Modal({ open, onClose, label, children }) {
  const [container] = useState(() =>
    typeof document === 'undefined' ? null : document.createElement('div'),
  );

  const dialogRef = useFocusTrap(open, onClose);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!container || typeof document === 'undefined') return undefined;
    document.body.appendChild(container);
    return () => container.remove();
  }, [container]);

  // Hide the main application from screen readers while the dialog is open, so
  // virtual cursor navigation cannot wander out of it.
  useEffect(() => {
    if (!open || typeof document === 'undefined') return undefined;
    const root = document.getElementById('root');
    root?.setAttribute('aria-hidden', 'true');
    return () => root?.removeAttribute('aria-hidden');
  }, [open]);

  const onBackdropClick = useCallback(
    (event) => {
      if (event.target === event.currentTarget) onClose();
    },
    [onClose],
  );

  if (!open || !container) return null;

  return createPortal(
    <div className="modal" onClick={onBackdropClick}>
      <div className="modal__backdrop" aria-hidden="true" />
      <div
        className="modal__panel notched"
        role="dialog"
        aria-modal="true"
        aria-label={label}
        tabIndex={-1}
        ref={dialogRef}
      >
        <button className="modal__close" type="button" onClick={onClose}>
          <span className="sr-only">Close dialog</span>
          <PixelIcon name="close" size={16} />
        </button>
        {children}
      </div>
    </div>,
    container,
  );
}

export default Modal;
