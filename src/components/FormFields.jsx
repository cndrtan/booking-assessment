/**
 * Small reusable form pieces used by every screen.
 * Field owns the label / hint / error line; the inputs stay dumb.
 */

import { useState, useEffect, useRef } from "react";
import { isoToDisplay, displayToISO, maskDate } from "../helpers/bookingHelpers";

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


export function DateInput({
  id,
  value,
  onChange,
  error,
  min,
  max,
  placeholder = "dd-mm-yyyy",
}) {
  const [text, setText] = useState(() => isoToDisplay(value));
  const pickerRef = useRef(null);

  // Follow the value when it changes from somewhere else (reset, start over,
  // the picker). Skip while the text already represents that same date, so we
  // don't fight the person mid-keystroke.
  useEffect(() => {
    if (displayToISO(text) !== value) setText(isoToDisplay(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleType = (raw) => {
    const masked = maskDate(raw);
    setText(masked);
    onChange(displayToISO(masked)); 
  };

  const handleBlur = () => {
    if (!displayToISO(text)) setText(isoToDisplay(value));
  };

  const openPicker = () => {
    const el = pickerRef.current;
    if (!el) return;
    try {
      el.showPicker();
    } catch {
      el.focus();
    }
  };

  return (
    <span className="hb-date">
      <input
        id={id}
        type="text"
        className="hb-input hb-input--date"
        value={text}
        placeholder={placeholder}
        inputMode="numeric"
        autoComplete="off"
        maxLength={10}
        aria-invalid={!!error}
        onChange={(e) => handleType(e.target.value)}
        onBlur={handleBlur}
      />

      <button
        type="button"
        className="hb-date-open"
        aria-label="Open calendar"
        onClick={openPicker}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
          <rect
            x="1.5"
            y="3"
            width="13"
            height="11.5"
            rx="1.5"
            fill="none"
            stroke="currentColor"
          />
          <path d="M1.5 6.5h13M5 1.5v3M11 1.5v3" fill="none" stroke="currentColor" />
        </svg>
      </button>

      {/* offscreen, only there to host the native calendar */}
      <input
        ref={pickerRef}
        type="date"
        className="hb-date-native"
        tabIndex={-1}
        aria-hidden="true"
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          onChange(e.target.value);
          setText(isoToDisplay(e.target.value));
        }}
      />
    </span>
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
