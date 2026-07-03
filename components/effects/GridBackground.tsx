/**
 * GridBackground — full-screen fixed dot-grid texture layer.
 *
 * Pure server component: no JS is needed.  The `.grid-background` class is
 * defined in globals.css and renders a radial-gradient dot pattern.
 * An optional `opacity` prop overrides the default opacity set in CSS.
 */

interface GridBackgroundProps {
  /** Overall opacity of the dot grid — default 0.04 */
  opacity?: number
  className?: string
}

export default function GridBackground({
  opacity = 0.04,
  className,
}: GridBackgroundProps) {
  return (
    <div
      className={`grid-background ${className ?? ""}`}
      style={{ opacity }}
      aria-hidden="true"
    />
  )
}
