import { InputEventsTypes } from '../../constants/InputEvents';
/**
 * Set default events for input
 * @param {Function} emit
 * @returns {Object}
 */
export const setInputEvents = emit => {
  let events = {};
  for (const event of InputEventsTypes) {
    const eventName = `on${event
      .toString()
      .substr(0, 1)
      .toUpperCase()}${event.toString().substr(1)}`;
    events[eventName] = (...args) => {
      return emit(event, ...args);
    };
  }
  return events;
};
