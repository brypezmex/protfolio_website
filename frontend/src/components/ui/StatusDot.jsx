import { cn } from '../../utils/cn.js';
import './StatusDot.css';

const LABELS = {
  online: 'Live',
  offline: 'Offline',
  unconfigured: 'Not deployed',
  unknown: 'Status unknown',
};

/**
 * Liveness indicator for a deployed service.
 *
 * Renders nothing when status is unknown, so a site without the backend simply
 * does not show badges rather than showing empty ones. Colour is never the only
 * signal - the state is always spelled out in text beside the dot.
 *
 * @param {object} props
 * @param {'online'|'offline'|'unconfigured'|'unknown'} props.status
 */
export function StatusDot({ status, className }) {
  if (!status || status === 'unknown') return null;

  return (
    <span className={cn('status', `status--${status}`, className)}>
      <span className="status__dot" aria-hidden="true" />
      {LABELS[status] ?? LABELS.unknown}
    </span>
  );
}

export default StatusDot;
