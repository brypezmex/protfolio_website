/**
 * Text that rolls to a copy of itself when an ancestor with `.roll-trigger` is
 * hovered or keyboard-focused. Styles live in utilities.css.
 *
 * Children must be plain text: the incoming copy is a text-shadow of the
 * label, which is what keeps it out of the accessibility tree.
 */
export function Roll({ children }) {
  return (
    <span className="roll">
      <span className="roll__text">{children}</span>
    </span>
  );
}

export default Roll;
