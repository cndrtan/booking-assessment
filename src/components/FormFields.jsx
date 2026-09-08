/**
 * Small reusable form pieces used by every screen.
 * Field owns the label / hint / error line; the inputs stay dumb.
 */

export function Field({ label, hint, error, htmlFor, children, wide }) {
  return (
    <div
      className={
        "hb-field" + (wide ? " hb-field--wide" : "") + (error ? " hb-field--bad" : "")
      }
    >
      <label className="hb-label" htmlFor={htmlFor}>
        {label}
      </label>

      {children}

      {error ? (
        <p className="hb-error" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="hb-hint">{hint}</p>
      ) : null}
    </div>
  );
}

export function TextInput({ id, value, onChange, error, ...rest }) {
  return (
    <input
      id={id}
      className="hb-input"
      value={value}
      aria-invalid={!!error}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    />
  );
}

export function SelectInput({ id, value, onChange, error, placeholder, options = [] }) {
  return (
    <select
      id={id}
      className="hb-input hb-select"
      value={value}
      aria-invalid={!!error}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

/** Read-only display box, e.g. the stay dates echoed on screen 2. */
export function ReadOnlyInput({ id, value }) {
  return <input id={id} className="hb-input hb-input--locked" readOnly value={value || "—"} />;
}

/** Inline text button used for "Edit" / "Change dates" links. */
export function LinkButton({ onClick, children }) {
  return (
    <button type="button" className="hb-link" onClick={onClick}>
      {children}
    </button>
  );
}
