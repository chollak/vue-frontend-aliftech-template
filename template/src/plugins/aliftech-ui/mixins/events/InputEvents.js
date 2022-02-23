import { InputEventsTypes } from "../../constants/InputEvents";

/**
 * Set default events for input
 * @param {Function} emit
 * @returns {Object}
 */
export const setInputEvents = (emit) => {
  let events = {};
  for (let event of InputEventsTypes) {
    events[event] = (e) => emit(event, e);
  }
  return events;
};
