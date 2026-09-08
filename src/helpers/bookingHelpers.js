/**
 * Pure helpers — no React, no side effects, easy to unit test.
 */

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

/** "2026-06-12" -> "Fri 12 Jun" */
export const fmtDate = (iso) =>
  !iso
    ? ""
    : new Date(iso + "T00:00:00").toLocaleDateString(undefined, {
        weekday: "short",
        day: "numeric",
        month: "short",
      });

/** Whole nights between two ISO dates; 0 when invalid or reversed. */
export const nightsBetween = (a, b) => {
  if (!a || !b) return 0;
  const ms = new Date(b + "T00:00:00") - new Date(a + "T00:00:00");
  return ms > 0 ? Math.round(ms / 86400000) : 0;
};

/** Today as an ISO date, for `min` on the date inputs. */
export const todayISO = () => new Date().toISOString().slice(0, 10);

/** Which date field the chosen transport mode uses. */
export const transportDateOf = (d) =>
  d.transportMode === "train" ? d.trainDate : d.transportMode === "flight" ? d.flightDate : "";

/** Non-blocking hint: is the journey date outside the hotel stay? */
export const isTransportOutsideStay = (d) => {
  const date = transportDateOf(d);
  if (!date || !d.checkIn || !d.checkOut) return false;
  return date < d.checkIn || date > d.checkOut;
};

/**
 * Validate one step of the flow.
 * @returns {Object} map of field name -> error message. Empty means valid.
 */
export function validateStep(step, d) {
  const e = {};

  /* ---- screen 1: dates + transport choice ---- */
  if (step === 0) {
    if (!d.checkIn) e.checkIn = "Pick a check-in date.";
    if (!d.checkOut) e.checkOut = "Pick a check-out date.";
    if (d.checkIn && d.checkOut && nightsBetween(d.checkIn, d.checkOut) < 1)
      e.checkOut = "Check-out must be after check-in.";
    if (d.includeTransport && !d.transportMode) e.transportMode = "Choose train or flight.";
  }

  /* ---- screen 2: hotel + (conditionally) journey ---- */
  if (step === 1) {
    if (!d.guestName.trim()) e.guestName = "Enter the guest's full name.";
    if (!d.guestEmail.trim()) e.guestEmail = "Enter an email for the confirmation.";
    else if (!isEmail(d.guestEmail)) e.guestEmail = "That email doesn't look right.";
    if (!d.roomType) e.roomType = "Choose a room type.";
    if (d.preferences.length === 0) e.preferences = "Pick at least one preference.";

    if (d.includeTransport) {
      if (!d.travelerName.trim()) e.travelerName = "Enter the traveller's name.";
      if (!d.travelerEmail.trim()) e.travelerEmail = "Enter the traveller's email.";
      else if (!isEmail(d.travelerEmail)) e.travelerEmail = "That email doesn't look right.";

      if (d.transportMode === "train") {
        if (!d.trainFrom.trim()) e.trainFrom = "Enter the departure station.";
        if (!d.trainTo.trim()) e.trainTo = "Enter the destination station.";
        else if (d.trainTo.trim().toLowerCase() === d.trainFrom.trim().toLowerCase())
          e.trainTo = "Destination must differ from departure.";
        if (!d.trainDate) e.trainDate = "Pick a travel date.";
      }

      if (d.transportMode === "flight") {
        if (!d.flightFrom.trim()) e.flightFrom = "Enter the departure airport.";
        if (!d.flightTo.trim()) e.flightTo = "Enter the destination airport.";
        else if (d.flightTo.trim().toLowerCase() === d.flightFrom.trim().toLowerCase())
          e.flightTo = "Destination must differ from departure.";
        if (!d.airline) e.airline = "Choose an airline.";
        if (!d.flightDate) e.flightDate = "Pick a travel date.";
      }
    }
  }

  /* screen 2 is the last one with inputs, so step 3 needs no rules */
  return e;
}
