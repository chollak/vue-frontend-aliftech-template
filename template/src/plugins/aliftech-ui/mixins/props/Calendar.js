import calendarDates from '../../validations/CalendarDates';
export default {
  props: {
    range: { type: Boolean, default: false },
    disabledDates: {
      type: [Array, Object],
      validator: calendarDates,
      default: undefined,
    },
    allowedDates: {
      type: [Array, Object],
      validator: calendarDates,
      default: undefined,
    },
    type: {
      type: String,
      default: 'date',
      validator: value => {
        return (
          value === 'date' || value === 'month' || value === 'year' || value === 'quarter' || value === 'half-year'
        );
      },
    },
  },
};
