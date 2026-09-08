import { useState, useEffect, useMemo, useRef } from "react";

import StepperHeader from "./components/StepperHeader";
import BookingScreen from "./screens/bookingScreen";
import DetailsBookingScreen from "./screens/detailsBookingScreen";
import ReviewScreen from "./screens/reviewScreen";

import { EMPTY, STEPS } from "./config/bookingConfig";
import { validateStep, nightsBetween, fmtDate } from "./helpers/bookingHelpers";

import "./styles/booking.css";

/**
 * The only stateful component in the flow. Screens stay presentational:
 * they receive `data`, `errors`, `set` and `goTo` and nothing else.
 */
export default function BookingWizard() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [toast, setToast] = useState(null);
  const topRef = useRef(null);

  const nights = nightsBetween(data.checkIn, data.checkOut);

  /** Merge a patch into the form. Keeps traveller fields mirrored when asked. */
  const set = (patch) =>
    setData((prev) => {
      const next = { ...prev, ...patch };
      if (next.sameAsGuest) {
        next.travelerName = next.guestName;
        next.travelerEmail = next.guestEmail;
      }
      return next;
    });

  /* Once the person has been shown errors, re-validate as they type so
     messages clear themselves instead of waiting for the next click. */
  useEffect(() => {
    if (showErrors) setErrors(validateStep(step, data));
  }, [data, step, showErrors]);

  const scrollTop = () =>
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  /**
   * Central navigation. Backwards is always allowed; forwards runs
   * validation on every step in between and stops at the first failure.
   */
  const goTo = (target) => {
    if (target === step || target < 0 || target > STEPS.length - 1) return;

    if (target < step) {
      setShowErrors(false);
      setErrors({});
      setStep(target);
      scrollTop();
      return;
    }

    for (let s = step; s < target; s++) {
      const stepErrors = validateStep(s, data);
      if (Object.keys(stepErrors).length) {
        setStep(s);
        setErrors(stepErrors);
        setShowErrors(true);
        scrollTop();
        return;
      }
    }

    setShowErrors(false);
    setErrors({});
    setStep(target);
    scrollTop();
  };

  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);

  const submit = () => {
    setToast({
      ref: "BK-" + Math.random().toString(36).slice(2, 7).toUpperCase(),
      line: data.includeTransport
        ? `${nights} night${nights === 1 ? "" : "s"} + ${data.transportMode}`
        : `${nights} night${nights === 1 ? "" : "s"}`,
      email: data.guestEmail,
    });
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const startOver = () => {
    setData(EMPTY);
    setErrors({});
    setShowErrors(false);
    setToast(null);
    setStep(0);
  };

  const completed = useMemo(
    () => STEPS.map((_, i) => i < step && Object.keys(validateStep(i, data)).length === 0),
    [step, data]
  );

  const ribbon = [
    data.checkIn && data.checkOut
      ? `${fmtDate(data.checkIn)} → ${fmtDate(data.checkOut)}`
      : null,
    nights ? `${nights} night${nights === 1 ? "" : "s"}` : null,
    data.includeTransport
      ? data.transportMode
        ? data.transportMode === "train"
          ? "By train"
          : "By flight"
        : "Travel to add"
      : null,
  ].filter(Boolean);

  const errorCount = Object.keys(errors).length;
  const screenProps = { data, errors, set, goTo };

  return (
    <div className="hb-root">
      <div className="hb-shell" ref={topRef}>
        <header className="hb-head">
          <p className="hb-brand">Marisol Bay Hotel</p>
          <h1 className="hb-title">Plan your stay</h1>

          <div className="hb-ribbon" aria-live="polite">
            {ribbon.length ? (
              ribbon.map((r, i) => (
                <span key={i} className="hb-ribbon-item">
                  {r}
                </span>
              ))
            ) : (
              <span className="hb-ribbon-empty">
                Your dates will show up here as you fill them in.
              </span>
            )}
          </div>
        </header>

        <StepperHeader step={step} completed={completed} onNavigate={goTo} />

        <main className="hb-card">
          {showErrors && errorCount > 0 && (
            <div className="hb-alert" role="alert">
              {errorCount === 1
                ? "One field still needs your attention."
                : `${errorCount} fields still need your attention.`}
            </div>
          )}

          {step === 0 && <BookingScreen {...screenProps} />}
          {step === 1 && <DetailsBookingScreen {...screenProps} />}
          {step === 2 && <ReviewScreen {...screenProps} />}

          <footer className="hb-actions">
            {step > 0 ? (
              <button type="button" className="hb-btn hb-btn--quiet" onClick={back}>
                Previous
              </button>
            ) : (
              <span />
            )}

            {step < STEPS.length - 1 ? (
              <button type="button" className="hb-btn hb-btn--go" onClick={next}>
                Next
              </button>
            ) : (
              <button type="button" className="hb-btn hb-btn--go" onClick={submit}>
                Submit booking
              </button>
            )}
          </footer>
        </main>
      </div>

      {toast && (
        <div className="hb-toast" role="status">
          <div>
            <strong>Booking submitted</strong>
            <p>
              Reference {toast.ref} · {toast.line}. A confirmation is on its way to{" "}
              {toast.email}.
            </p>
          </div>
          <div className="hb-toast-acts">
            <button type="button" className="hb-link" onClick={startOver}>
              Start another
            </button>
            <button
              type="button"
              className="hb-x"
              aria-label="Dismiss"
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
