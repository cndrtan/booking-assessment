import { STEPS } from "../config/bookingConfig";

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
                aria-label={`Step ${i + 1} of ${STEPS.length}: ${s.title}`}
              >
                <span className="hb-dot">{state === "done" ? "✓" : i + 1}</span>
                <span className="hb-step-label">
                  <span className="hb-step-long">{s.title}</span>
                  <span className="hb-step-short">{s.short ?? s.title}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
