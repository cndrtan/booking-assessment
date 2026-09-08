import { LinkButton } from "../components/FormFields";
import { fmtDate, nightsBetween } from "../helpers/bookingHelpers";

export default function ReviewScreen({ data, goTo }) {
  const nights = nightsBetween(data.checkIn, data.checkOut);

  const transportTitle = !data.includeTransport
    ? "Transportation"
    : data.transportMode === "train"
    ? "Train"
    : "Flight";

  return (
    <section className="hb-section">
      <h2 className="hb-h2">Check everything over</h2>

      <Summary title="Stay" onEdit={() => goTo(0)}>
        <Row k="Check-in" v={fmtDate(data.checkIn)} />
        <Row k="Check-out" v={fmtDate(data.checkOut)} />
        <Row k="Nights" v={nights ? String(nights) : ""} />
      </Summary>

      <Summary title="Room" onEdit={() => goTo(1)}>
        <Row k="Guest" v={data.guestName} />
        <Row k="Email" v={data.guestEmail} />
        <Row k="Room type" v={data.roomType} />
        <Row k="Preferences" v={data.preferences.join(", ")} />
      </Summary>

      <Summary title={transportTitle} onEdit={() => goTo(data.includeTransport ? 1 : 0)}>
        {!data.includeTransport ? (
          <Row k="Included" v="Not added" />
        ) : data.transportMode === "train" ? (
          <>
            <Row k="Traveller" v={data.travelerName} />
            <Row k="Email" v={data.travelerEmail} />
            <Row k="From" v={data.trainFrom} />
            <Row k="To" v={data.trainTo} />
            <Row k="Date" v={fmtDate(data.trainDate)} />
          </>
        ) : (
          <>
            <Row k="Traveller" v={data.travelerName} />
            <Row k="Email" v={data.travelerEmail} />
            <Row k="From" v={data.flightFrom} />
            <Row k="To" v={data.flightTo} />
            <Row k="Airline" v={data.airline} />
            <Row k="Date" v={fmtDate(data.flightDate)} />
          </>
        )}
      </Summary>
    </section>
  );
}

function Summary({ title, onEdit, children }) {
  return (
    <div className="hb-sum">
      <div className="hb-sum-head">
        <h3>{title}</h3>
        <LinkButton onClick={onEdit}>Edit</LinkButton>
      </div>
      <dl className="hb-rows">{children}</dl>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="hb-row">
      <dt>{k}</dt>
      <dd>{v || "—"}</dd>
    </div>
  );
}
