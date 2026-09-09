/**
 * Generated data-flow diagram used as a project's preview image.
 *
 * Real thumbnails would mean screenshots that go stale the moment the UI
 * changes, plus image weight on every card. A schematic drawn from the
 * project's own `preview.nodes` array stays accurate, costs nothing to load,
 * and says more about the system than a screenshot of a form would.
 *
 * @param {object} props
 * @param {string[]} props.nodes ordered stages of the data flow
 * @param {string} props.projectName used for the accessible description
 */
export function ProjectSchematic({ nodes, projectName }) {
  if (!nodes?.length) return null;

  return (
    <figure className="schematic">
      <ol className="schematic__flow" aria-hidden="true">
        {nodes.map((node, index) => (
          <li className="schematic__node" key={node} style={{ '--i': index }}>
            <span className="schematic__box notched--sm">{node}</span>
            {index < nodes.length - 1 ? (
              <span className="schematic__arrow" aria-hidden="true" />
            ) : null}
          </li>
        ))}
      </ol>

      {/* The visual is decorative; this carries the same information as text. */}
      <figcaption className="sr-only">
        {projectName} data flow: {nodes.join(', then ')}.
      </figcaption>
    </figure>
  );
}

export default ProjectSchematic;
