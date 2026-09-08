import { Field, DateInput } from "../components/FormFields";
import { TRANSPORT_MODES } from "../config/bookingConfig";
import { nightsBetween, todayISO } from "../helpers/bookingHelpers";

export default function BookingScreen({ data, errors, set }) {
  const today = todayISO();
  const nights = nightsBetween(data.checkIn, data.checkOut);

  const onCheckInChange = (v) =>
    set({
      checkIn: v,
      checkOut: data.checkOut && data.checkOut <= v ? "" : data.checkOut,
    });

  const onTransportToggle = (checked) =>
    set({
      includeTransport: checked,
      transportMode: checked ? data.transportMode : "",
    });

  return (
    <section className="hb-section">
      <h2 className="hb-h2">When are you staying?</h2>

      <div className="hb-grid">
        <Field label="Check-in" htmlFor="checkIn" error={errors.checkIn}>
          <DateInput
            id="checkIn"
            min={today}
            value={data.checkIn}
            error={errors.checkIn}
            onChange={onCheckInChange}
          />
        </Field>

        <Field
          label="Check-out"
          htmlFor="checkOut"
          error={errors.checkOut}
          hint={nights ? `${nights} night${nights === 1 ? "" : "s"}` : undefined}
        >
          <DateInput
            id="checkOut"
            min={data.checkIn || today}
            value={data.checkOut}
            error={errors.checkOut}
            onChange={(v) => set({ checkOut: v })}
          />
        </Field>
      </div>

      <hr className="hb-rule" />

      <h2 className="hb-h2">Getting there</h2>

      <label className="hb-check hb-check--lead">
        <input
          type="checkbox"
          checked={data.includeTransport}
          onChange={(e) => onTransportToggle(e.target.checked)}
        />
        <span>
          <strong>Add transportation to this booking</strong>
          <em>We'll collect the journey details on the next step.</em>
        </span>
      </label>

      {/* dynamic block — only mounted while the box is ticked */}
      {data.includeTransport && (
        <fieldset className={"hb-modes" + (errors.transportMode ? " hb-field--bad" : "")}>
          <legend className="hb-label">How will you travel?</legend>

          <div className="hb-mode-row">
            {TRANSPORT_MODES.map((m) => (
              <label
                key={m.key}
                className={"hb-mode" + (data.transportMode === m.key ? " is-on" : "")}
              >
                <input
                  type="radio"
                  name="transportMode"
                  value={m.key}
                  checked={data.transportMode === m.key}
                  onChange={() => set({ transportMode: m.key })}
                />
                <span className="hb-mode-name">{m.name}</span>
                <span className="hb-mode-note">{m.note}</span>
              </label>
            ))}
          </div>

          {errors.transportMode && (
            <p className="hb-error" role="alert">
              {errors.transportMode}
            </p>
          )}
        </fieldset>
      )}
    </section>
  );
}
