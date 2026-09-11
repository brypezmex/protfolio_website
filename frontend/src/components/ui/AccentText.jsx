const ACCENT = /\{([^}]+)\}/g;

/**
 * Expands `{X}` markers in a string into italic-serif accent spans.
 *
 * Copy stays a plain string in the data files - "Full-{S}tack {D}eveloper" -
 * and this is the only place that knows how an accent is rendered. The spans
 * are inline, so screen readers still read "Full-Stack Developer" as words.
 *
 * @param {object} props
 * @param {string} props.text
 */
export function AccentText({ text }) {
  const parts = [];
  let cursor = 0;

  for (const match of text.matchAll(ACCENT)) {
    if (match.index > cursor) parts.push(text.slice(cursor, match.index));
    parts.push(
      <span className="accent" key={match.index}>
        {match[1]}
      </span>,
    );
    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));

  return <>{parts}</>;
}

export default AccentText;
