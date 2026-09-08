import { STEPS } from "../config/bookingConfig";

/**
 * Clickable step header. `completed` is an array of booleans, one per step.
 * Navigation rules live in the parent (BookingWizard.goTo).
 */
export default function StepperHeader({ step, completed, onNavigate }) {
  return (
    <nav aria-label="Booking steps">
      <ol className="hb-steps">
        {STEPS.map((s, i) => {
          const state =
            i === step ? "current" : completed[i] ? "done" : i < step ? "seen" : "todo";

          return (
            <li key={s.id} className={`hb-step hb-step--${state}`}>
              <button
                type="button"
                className="hb-step-btn"
                onClick={() => onNavigate(i)}
                aria-current={i === step ? "step" : undefined}
              >
                <span className="hb-dot">{state === "done" ? "✓" : i + 1}</span>
                <span className="hb-step-label">{s.title}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
