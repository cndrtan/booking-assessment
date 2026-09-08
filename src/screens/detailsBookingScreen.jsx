import {
  Field,
  TextInput,
  DateInput,
  SelectInput,
  ReadOnlyInput,
  LinkButton,
} from "../components/FormFields";
import { ROOM_TYPES, PREFERENCES, AIRLINES } from "../config/bookingConfig";
import { fmtDate, isTransportOutsideStay } from "../helpers/bookingHelpers";

export default function DetailsBookingScreen({ data, errors, set, goTo }) {
  const outsideStay = isTransportOutsideStay(data);

  const togglePreference = (p) =>
    set({
      preferences: data.preferences.includes(p)
        ? data.preferences.filter((x) => x !== p)
        : [...data.preferences, p],
    });

  const onSameAsGuestToggle = (checked) =>
    set({
      sameAsGuest: checked,
      travelerName: checked ? data.guestName : data.travelerName,
      travelerEmail: checked ? data.guestEmail : data.travelerEmail,
    });

  return (
    <section className="hb-section">
      <h2 className="hb-h2">Room</h2>

      <div className="hb-grid">
        <Field label="Guest name" htmlFor="guestName" error={errors.guestName}>
          <TextInput
            id="guestName"
            value={data.guestName}
            error={errors.guestName}
            placeholder="As printed on ID"
            onChange={(v) => set({ guestName: v })}
          />
        </Field>

        <Field label="Guest email" htmlFor="guestEmail" error={errors.guestEmail}>
          <TextInput
            id="guestEmail"
            type="email"
            value={data.guestEmail}
            error={errors.guestEmail}
            placeholder="name@example.com"
            onChange={(v) => set({ guestEmail: v })}
          />
        </Field>

        <Field label="Room type" htmlFor="roomType" error={errors.roomType}>
          <SelectInput
            id="roomType"
            value={data.roomType}
            error={errors.roomType}
            placeholder="Choose a room"
            options={ROOM_TYPES}
            onChange={(v) => set({ roomType: v })}
          />
        </Field>

        <Field label="Stay" htmlFor="stayEcho">
          <ReadOnlyInput
            id="stayEcho"
            value={
              data.checkIn && data.checkOut
                ? `${fmtDate(data.checkIn)} -> ${fmtDate(data.checkOut)}`
                : ""
            }
          />
          <p className="hb-hint">
            <LinkButton onClick={() => goTo(0)}>Change dates</LinkButton>
          </p>
        </Field>
      </div>

      <Field label="Preferences" error={errors.preferences} wide>
        <div className="hb-chips">
          {PREFERENCES.map((p) => {
            const on = data.preferences.includes(p);
            return (
              <label key={p} className={"hb-chip" + (on ? " is-on" : "")}>
                <input type="checkbox" checked={on} onChange={() => togglePreference(p)} />
                {p}
              </label>
            );
          })}
        </div>
      </Field>

      {/* dynamic section — driven entirely by screen 1 */}
      {data.includeTransport ? (
        <>
          <hr className="hb-rule" />
          <h2 className="hb-h2">
            {data.transportMode === "train" ? "Train journey" : "Flight"}
          </h2>

          <label className="hb-check">
            <input
              type="checkbox"
              checked={data.sameAsGuest}
              onChange={(e) => onSameAsGuestToggle(e.target.checked)}
            />
            <span>
              <strong>Traveller is the same as the hotel guest</strong>
            </span>
          </label>

          <div className="hb-grid">
            <Field label="Traveller name" htmlFor="travelerName" error={errors.travelerName}>
              <TextInput
                id="travelerName"
                value={data.travelerName}
                error={errors.travelerName}
                disabled={data.sameAsGuest}
                onChange={(v) => set({ travelerName: v })}
              />
            </Field>

            <Field label="Traveller email" htmlFor="travelerEmail" error={errors.travelerEmail}>
              <TextInput
                id="travelerEmail"
                type="email"
                value={data.travelerEmail}
                error={errors.travelerEmail}
                disabled={data.sameAsGuest}
                onChange={(v) => set({ travelerEmail: v })}
              />
            </Field>

            {data.transportMode === "train" ? (
              <TrainFields data={data} errors={errors} set={set} outsideStay={outsideStay} />
            ) : (
              <FlightFields data={data} errors={errors} set={set} outsideStay={outsideStay} />
            )}
          </div>
        </>
      ) : (
        <p className="hb-note">
          No transportation on this booking.{" "}
          <LinkButton onClick={() => goTo(0)}>Add it on step 1</LinkButton>
        </p>
      )}
    </section>
  );
}

/* -------------------------------------------------------------- */
/* mode-specific field sets                                        */
/* -------------------------------------------------------------- */

function TrainFields({ data, errors, set, outsideStay }) {
  return (
    <>
      <Field label="Departure station" htmlFor="trainFrom" error={errors.trainFrom}>
        <TextInput
          id="trainFrom"
          value={data.trainFrom}
          error={errors.trainFrom}
          placeholder="Gambir"
          onChange={(v) => set({ trainFrom: v })}
        />
      </Field>

      <Field label="Destination station" htmlFor="trainTo" error={errors.trainTo}>
        <TextInput
          id="trainTo"
          value={data.trainTo}
          error={errors.trainTo}
          placeholder="Bandung"
          onChange={(v) => set({ trainTo: v })}
        />
      </Field>

      <Field
        label="Travel date"
        htmlFor="trainDate"
        error={errors.trainDate}
        hint={outsideStay ? "This date falls outside your stay." : undefined}
      >
        <DateInput
          id="trainDate"
          value={data.trainDate}
          error={errors.trainDate}
          onChange={(v) => set({ trainDate: v })}
        />
      </Field>
    </>
  );
}

function FlightFields({ data, errors, set, outsideStay }) {
  return (
    <>
      <Field label="Departure airport" htmlFor="flightFrom" error={errors.flightFrom}>
        <TextInput
          id="flightFrom"
          value={data.flightFrom}
          error={errors.flightFrom}
          placeholder="CGK"
          onChange={(v) => set({ flightFrom: v })}
        />
      </Field>

      <Field label="Destination airport" htmlFor="flightTo" error={errors.flightTo}>
        <TextInput
          id="flightTo"
          value={data.flightTo}
          error={errors.flightTo}
          placeholder="DPS"
          onChange={(v) => set({ flightTo: v })}
        />
      </Field>

      <Field label="Airline" htmlFor="airline" error={errors.airline}>
        <SelectInput
          id="airline"
          value={data.airline}
          error={errors.airline}
          placeholder="Choose an airline"
          options={AIRLINES}
          onChange={(v) => set({ airline: v })}
        />
      </Field>

      <Field
        label="Travel date"
        htmlFor="flightDate"
        error={errors.flightDate}
        hint={outsideStay ? "This date falls outside your stay." : undefined}
      >
        <DateInput
          id="flightDate"
          value={data.flightDate}
          error={errors.flightDate}
          onChange={(v) => set({ flightDate: v })}
        />
      </Field>
    </>
  );
}
