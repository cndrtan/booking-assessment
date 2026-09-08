/**
 * Static configuration for the booking flow.
 * Everything a non-developer might want to change lives here.
 */

export const STEPS = [
  // `short` is the label used on narrow screens
  { id: "stay", title: "Dates & travel", short: "Dates" },
  { id: "details", title: "Room & journey", short: "Details" },
  { id: "review", title: "Review", short: "Review" },
];

export const ROOM_TYPES = [
  "Standard queen",
  "Deluxe king",
  "Twin double",
  "Suite",
  "Family room",
];

export const PREFERENCES = [
  "Non-smoking",
  "High floor",
  "Quiet side",
  "Late checkout",
  "Airport shuttle",
  "Crib in room",
];

export const AIRLINES = [
  "Garuda Indonesia",
  "Singapore Airlines",
  "Qantas",
  "Emirates",
  "AirAsia",
  "Batik Air",
];

export const TRANSPORT_MODES = [
  { key: "train", name: "Train", note: "Station to station" },
  { key: "flight", name: "Flight", note: "Airport to airport" },
];

/** The initial shape of the whole form. Also used by "start over". */
export const EMPTY = {
  // screen 1
  checkIn: "",
  checkOut: "",
  includeTransport: false,
  transportMode: "",

  // screen 2 — hotel
  guestName: "",
  guestEmail: "",
  roomType: "",
  preferences: [],

  // screen 2 — traveller
  sameAsGuest: true,
  travelerName: "",
  travelerEmail: "",

  // screen 2 — train
  trainFrom: "",
  trainTo: "",
  trainDate: "",

  // screen 2 — flight
  flightFrom: "",
  flightTo: "",
  airline: "",
  flightDate: "",
};
