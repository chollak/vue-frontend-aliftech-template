import { h, ref, computed, watch, Transition, capitalize, toRefs, defineComponent } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/outline/esm';
import { ChevronDownIcon } from '@heroicons/vue/solid/esm';
import { short as shortWeeks } from '../../constants/weeks';
import { full as fullMonths, short as shortMonths } from '../../constants/months';
import { full as fullQuarters } from '../../constants/quarters';
import { full as fullHalfYears } from '../../constants/halfYears';
import { uiConfig } from '../../index';
import { checkType, getDateByHalfYear, getHalfYearByDate, getQuarterByDate } from '../../utils';
import Calendar from '../../mixins/props/Calendar';
import { getDateByQuarter } from '~/plugins/aliftech-ui/utils/getDateByQuarter';

export default defineComponent({
  name: 'AtCalendar',
  emits: ['update:modelValue'],
  props: {
    ...Calendar.props,
    modelValue: { type: [String, Date, Array], default: new Date() },
  },
  setup(props, { emit }) {
    //// Properties
    let currentMonth = ref(new Date().getMonth() + 1);
    let selectedMonth = ref(new Date().getMonth() + 1);
    let currentYear = ref(new Date().getFullYear());
    let selectedYear = ref(new Date().getFullYear());
    let selectedQuarter = ref(getQuarterByDate(new Date()));
    let selectedHalfYear = ref(getHalfYearByDate(new Date()));
    let monthDays = ref([]);
    let showMonthYearDropdown = ref(false);
    let selectedDay = ref(null);
    let value = toRefs(props).modelValue;
    let dateRange = ref([new Date(), new Date()]);
    // let dateRangeBetweenDays = ref(0);
    //// Properties -END

    if (value.value && !props.range) {
      currentMonth.value = new Date(props.modelValue).getMonth() + 1;
      selectedMonth.value = new Date(props.modelValue).getMonth() + 1;
      currentYear.value = new Date(props.modelValue).getFullYear();
      selectedYear.value = new Date(props.modelValue).getFullYear();
      selectedDay.value = new Date(props.modelValue).getDate();
      selectedQuarter.value = Math.floor(getQuarterByDate(new Date(props.modelValue)));
      selectedHalfYear.value = Math.floor(getHalfYearByDate(new Date(props.modelValue)));
    } else if (props.range && value.value.length === 2) {
      dateRange.value = value.value;
      selectedQuarter.value = Math.floor(getQuarterByDate(new Date(dateRange.value[0])));
      selectedHalfYear.value = Math.floor(getHalfYearByDate(new Date(dateRange.value[0])));
      selectedYear.value = new Date(dateRange.value[0]).getFullYear();
      currentYear.value = new Date(dateRange.value[0]).getFullYear();
      selectedMonth.value = new Date(dateRange.value[0]).getMonth() + 1;
      currentMonth.value = new Date(dateRange.value[0]).getMonth() + 1;
    }

    //// Computed properties
    /**
     * Array of years to select
     * @type {ComputedRef<*[]>}
     */
    const yearsToSelect = computed(() => {
      let years = [];
      const currentYear = new Date().getFullYear();
      for (let i = -5; i < 5; i++) {
        years.push(currentYear + i);
      }
      return years;
    });

    /**
     * Get days before 1st day of current month to print
     * @type {ComputedRef<VNode<RendererNode, RendererElement, {[p: string]: any}>[]>}
     */
    const daysBeforeCurrentMonthDays = computed(() => {
      let days = [];
      const prevMonthDate = new Date(selectedYear.value, currentMonth.value - 1, 0).getDate();
      for (let i = 0; i < monthDays.value[0].weekDay - 1; i++) {
        days.unshift(prevMonthDate - i);
      }
      return days.map(day => {
        const allowed = isAllowedDate(new Date(selectedYear.value, (currentMonth.value - 2) % 12, day));
        return h(
          'button',
          {
            class: [
              'transition duration-150 p-2 w-auto text-center',
              allowed ? 'text-gray-300 hover:text-gray-400' : 'cursor-not-allowed text-gray-200',
            ],
            onClick: () => (allowed ? setPrevMonthDate(day) : null),
          },
          day
        );
      });
    });

    /**
     * Get days after last day of current month to print
     * @type {ComputedRef<VNode<RendererNode, RendererElement, {[p: string]: any}>[]>}
     */
    const daysAfterCurrentMonthDays = computed(() => {
      let days = [];
      for (let i = 0; i < 7 - monthDays.value[monthDays.value.length - 1].weekDay; i++) {
        days.push(i + 1);
      }
      return days.map(day => {
        let nextMonth = currentMonth.value;
        let yearOfNextMonth = selectedYear.value;
        if (nextMonth > 12) {
          yearOfNextMonth++;
          nextMonth = 1;
        }
        const allowed = isAllowedDate(new Date(yearOfNextMonth, nextMonth, day));

        return h(
          'button',
          {
            class: [
              'transition duration-150 p-2 w-auto text-center',
              allowed ? 'text-gray-300 hover:text-gray-400' : 'cursor-not-allowed text-gray-200',
            ],
            onClick: () => (allowed ? setNextMonthDate(day) : null),
          },
          day
        );
      });
    });
    /**
     * The title of datepicker
     * @type {ComputedRef<string>}
     */
    const headerTitle = computed(() => {
      const monthName = fullMonths[currentMonth.value - 1];
      return `${capitalize(monthName)} ${selectedYear.value}`;
    });
    //// Computed properties - END

    /**
     * Get Date without time
     * @param {Date} date
     * @returns {Date}
     */
    const getDateWithoutTime = date => {
      const dateWithoutTime = new Date(date);
      dateWithoutTime.setHours(0, 0, 0, 0);
      return dateWithoutTime;
    };

    /**
     * Check if date is allowed
     * @param {Date} date
     * @returns {boolean}
     */
    const isAllowedDate = date => {
      if (props.allowedDates) {
        if (checkType(props.allowedDates, 'array')) {
          return props.allowedDates.some(
            allowedDate => getDateWithoutTime(date).getTime() === getDateWithoutTime(allowedDate).getTime()
          );
        } else if (checkType(props.allowedDates, 'object')) {
          return (
            getDateWithoutTime(props.allowedDates.from).getTime() <= getDateWithoutTime(date).getTime() &&
            getDateWithoutTime(props.allowedDates.to).getTime() >= getDateWithoutTime(date).getTime()
          );
        }
      }
      if (props.disabledDates) {
        if (checkType(props.disabledDates, 'array')) {
          return !props.disabledDates.some(disabledDate => {
            return getDateWithoutTime(date).getTime() === getDateWithoutTime(disabledDate).getTime();
          });
        } else if (checkType(props.disabledDates, 'object')) {
          return (
            getDateWithoutTime(props.disabledDates.from).getTime() > getDateWithoutTime(date).getTime() &&
            getDateWithoutTime(props.disabledDates.to).getTime() < getDateWithoutTime(date).getTime()
          );
        }
      }
      return true;
    };

    //// Watchers
    if (props.range) {
      watch(
        dateRange,
        () => {
          if (dateRange.value.length === 2) {
            if (new Date(dateRange.value[0]) > new Date(dateRange.value[1])) {
              dateRange.value = dateRange.value.reverse();
            }
            emit('update:modelValue', dateRange.value);
          }
        },
        { deep: true }
      );
    } else {
      watch(selectedDay, () => {
        const date = new Date(selectedYear.value, currentMonth.value - 1, selectedDay.value);
        emit('update:modelValue', date);
      });
    }

    //// Watchers - END

    //// Internal handlers
    /**
     * Return the day week number
     * @param {number} date
     * @returns {number|number}
     */
    const getDayOfDate = date => {
      const weekDay = new Date(selectedYear.value, currentMonth.value - 1, date).getDay();
      return weekDay || 7;
    };

    /**
     * Get current month days count
     * @returns {void}
     */
    const getCurrentMonthDays = () => {
      let daysInMonth = new Date(selectedYear.value, currentMonth.value, 0).getDate();
      let days = [];

      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          weekDay: getDayOfDate(day),
          date: day,
          allowed: isAllowedDate(new Date(selectedYear.value, currentMonth.value - 1, day)),
        });
      }

      monthDays.value = days;
    };

    /**
     * Get current years list
     * @returns {Array}
     */
    const getCurrentYearsList = () => {
      const years = [];
      const currentYear = selectedYear.value;
      for (let i = -4; i < 5; i++) {
        const year = currentYear + i;
        const allowed = isAllowedDate(new Date(year, currentMonth.value - 1, 1));
        years.push({ value: year, allowed });
      }
      return years;
    };

    /**
     * Get quarters list
     * @returns {Array}
     */
    const getQuartersList = () => {
      const quarters = [];
      for (let quarter = 1; quarter <= 4; quarter++) {
        const { range: date } = getDateByQuarter(quarter, selectedYear.value);
        const allowed = isAllowedDate(date[0]) && isAllowedDate(date[1]);
        quarters.push({ value: quarter, title: fullQuarters[quarter], allowed });
      }
      return quarters;
    };

    /**
     * Get current years list
     * @returns {Array}
     */
    const getHalfYearList = () => {
      const halfYears = [];
      for (let halfYear = 1; halfYear <= 2; halfYear++) {
        const { range: date } = getDateByHalfYear(halfYear, selectedYear.value);
        const allowed = isAllowedDate(date[0]) && isAllowedDate(date[1]);
        halfYears.push({ value: halfYear, title: fullHalfYears[halfYear], allowed });
      }
      return halfYears;
    };

    const getPickerButtonClasses = condition => {
      return condition
        ? 'bg-' + uiConfig.primaryBackgroundColor + '-600 text-white'
        : 'text-gray-700 hover:bg-gray-100 active:bg-gray-300';
    };

    //// Internal handlers - END

    //// External handlers
    /**
     * Previous month days click handler
     * @param {number} day
     */
    const setPrevMonthDate = (day = selectedDay.value) => {
      if (currentMonth.value - 1 === 0) {
        currentMonth.value = 12;
        selectedYear.value--;
      } else {
        currentMonth.value--;
      }
      selectedDay.value = day;
      getCurrentMonthDays();
    };

    /**
     * Next month days click handler
     * @param {number} day
     */
    const setNextMonthDate = (day = selectedDay.value) => {
      if (currentMonth.value + 1 === 13) {
        currentMonth.value = 1;
        selectedYear.value++;
      } else {
        currentMonth.value++;
      }
      selectedDay.value = day;
      getCurrentMonthDays();
    };

    /**
     * Set current month from month selector
     * @param {number} month
     * @param {boolean} emittable
     */
    const setMonth = (month, emittable = true) => {
      if (currentMonth.value !== month + 1 || currentYear.value !== selectedYear.value) {
        currentMonth.value = month + 1;
        selectedMonth.value = month + 1;
        showMonthYearDropdown.value = false;
        if (props.type === 'date') {
          getCurrentMonthDays();
        }

        if (emittable) {
          if (props.range) {
            emit('update:modelValue', [
              getDateWithoutTime(new Date(selectedYear.value, currentMonth.value - 1, 1)),
              getDateWithoutTime(new Date(selectedYear.value, currentMonth.value, 0)),
            ]);
          } else {
            emit('update:modelValue', new Date(selectedYear.value, currentMonth.value - 1, selectedDay.value));
          }
        }
      }
    };

    /**
     * Set current year from year selector
     * @param {number} year
     * @param {boolean} emittable
     */
    const setYear = (year, emittable = true) => {
      if (currentYear.value !== year || selectedYear.value !== year) {
        selectedYear.value = year;
        showMonthYearDropdown.value = false;

        if (props.type === 'date') {
          getCurrentMonthDays();
        }

        if (emittable) {
          if (props.range) {
            emit('update:modelValue', [
              getDateWithoutTime(new Date(selectedYear.value, 0, 1)),
              getDateWithoutTime(new Date(selectedYear.value, 11 + 1, 0)),
            ]);
          } else {
            emit('update:modelValue', new Date(selectedYear.value, currentMonth.value - 1, selectedDay.value));
          }
        }
      }
    };

    /**
     * Set current quarter
     * @param {number} quarter
     * @param {boolean} emittable
     */
    const setQuarter = (quarter, emittable = true) => {
      selectedQuarter.value = quarter;

      const { single, range } = getDateByQuarter(quarter, selectedYear.value);
      if (emittable) {
        if (props.range) {
          emit('update:modelValue', [getDateWithoutTime(range[0]), getDateWithoutTime(range[1])]);
        } else {
          emit('update:modelValue', getDateWithoutTime(single));
        }
      }
    };

    /**
     * Set current half year
     * @param {number} year
     * @param {boolean} emittable
     */
    const setHalfYear = (halfYear, emittable = true) => {
      selectedHalfYear.value = halfYear;

      const { single, range } = getDateByHalfYear(halfYear, selectedYear.value);
      if (emittable) {
        if (props.range) {
          emit('update:modelValue', [getDateWithoutTime(range[0]), getDateWithoutTime(range[1])]);
        } else {
          emit('update:modelValue', getDateWithoutTime(single));
        }
      }
    };

    /**
     * Select day
     * @param {Object} day
     */
    const setCurrentDateDay = day => {
      selectedMonth.value = currentMonth.value;
      selectedDay.value = day.date;
    };

    const setDateRange = (day, month, year) => {
      if (dateRange.value[0] && dateRange.value[1]) {
        dateRange.value = [];
      }
      if (!dateRange.value[0] && !dateRange.value[1]) {
        dateRange.value[0] = new Date(year, month, day.date);
      } else if (dateRange.value[0] && !dateRange.value[1]) {
        dateRange.value[1] = new Date(year, month, day.date);
      }
    };

    const checkDayBetweenDateRange = day => {
      const date = new Date(selectedYear.value, currentMonth.value - 1, day.date);
      return (
        date > new Date(dateRange.value[0]) &&
        date.getMonth() === currentMonth.value - 1 &&
        date < new Date(dateRange.value[1]) &&
        date.getMonth() === currentMonth.value - 1
      );
    };

    const renderPickerTemplateByType = () => {
      if (props.type === 'date') {
        return h('div', { class: 'grid grid-cols-7 gap-1' }, [
          daysBeforeCurrentMonthDays.value,
          monthDays.value.map(day => {
            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-md',
                  day.allowed
                    ? getPickerButtonClasses(
                        props.range
                          ? dateRange.value.some(
                              date =>
                                date.getDate() === day.date &&
                                date.getMonth() + 1 === currentMonth.value &&
                                date.getFullYear() === selectedYear.value
                            )
                          : day.date === selectedDay.value &&
                              selectedMonth.value === currentMonth.value &&
                              selectedYear.value === currentYear.value
                      )
                    : 'cursor-not-allowed text-gray-200',
                  checkDayBetweenDateRange(day) ? 'bg-' + uiConfig.primaryBackgroundColor + '-100' : '',
                ],
                onClick: () => {
                  if (day.allowed) {
                    if (props.range) {
                      setDateRange(day, currentMonth.value - 1, selectedYear.value);
                      return;
                    }
                    setCurrentDateDay(day);
                  }
                },
              },
              day.date
            );
          }),
          daysAfterCurrentMonthDays.value,
        ]);
      }
      if (props.type === 'month') {
        return h('div', { class: 'grid grid-cols-3 gap-1' }, [
          fullMonths.map((month, index) => {
            const allowed = isAllowedDate(new Date(selectedYear.value, index, 1));

            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-md',
                  allowed
                    ? getPickerButtonClasses(
                        index + 1 === currentMonth.value && selectedYear.value === currentYear.value
                      )
                    : 'cursor-not-allowed text-gray-200',
                ],
                onClick: () => (allowed ? setMonth(index) : null),
              },
              capitalize(month)
            );
          }),
        ]);
      }
      if (props.type === 'year') {
        const years = getCurrentYearsList();
        return h('div', { class: 'grid grid-cols-3 gap-1' }, [
          years.map(year => {
            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-md',
                  year.allowed
                    ? getPickerButtonClasses(year.value === currentYear.value)
                    : 'cursor-not-allowed text-gray-200',
                ],
                onClick: () => (year.allowed ? setYear(year.value) : null),
              },
              year.value
            );
          }),
        ]);
      }
      if (props.type === 'quarter') {
        const quarters = getQuartersList();
        return h('div', { class: 'grid grid-cols-2 gap-1' }, [
          quarters.map(quarter => {
            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-full',
                  quarter.allowed
                    ? getPickerButtonClasses(
                        quarter.value === selectedQuarter.value && currentYear.value === selectedYear.value
                      )
                    : 'cursor-not-allowed text-gray-200',
                ],
                onClick: () => (quarter.allowed ? setQuarter(quarter.value) : null),
              },
              capitalize(quarter.title)
            );
          }),
        ]);
      }
      if (props.type === 'half-year') {
        const halfYears = getHalfYearList();
        return h('div', { class: 'grid grid-cols-2 gap-1' }, [
          halfYears.map(halfYear => {
            return h(
              'button',
              {
                class: [
                  'transition duration-150 p-1 w-auto text-center rounded-full',
                  halfYear.allowed
                    ? getPickerButtonClasses(
                        halfYear.value === selectedHalfYear.value && currentYear.value === selectedYear.value
                      )
                    : 'cursor-not-allowed text-gray-200',
                ],
                onClick: () => (halfYear.allowed ? setHalfYear(halfYear.value) : null),
              },
              capitalize(halfYear.title)
            );
          }),
        ]);
      }
    };
    //// External handles - END

    if (props.type === 'date') {
      getCurrentMonthDays();
    }

    return {
      monthDays,
      selectedDay,
      selectedYear,
      currentYear,
      currentMonth,
      headerTitle,
      showMonthYearDropdown,
      yearsToSelect,
      dateRange,
      setMonth,
      setYear,
      setPrevMonthDate,
      setNextMonthDate,
      renderPickerTemplateByType,
      daysBeforeCurrentMonthDays,
      daysAfterCurrentMonthDays,
      setCurrentDateDay,
    };
  },
  render() {
    return h('div', { class: 'block w-full h-full' }, [
      h(
        'div',
        {
          class: 'flex justify-between items-center h-12 border-b-2 border-gray-200 mb-1',
        },
        [
          h(
            'button',
            {
              class: 'p-2 transition duration-150 rounded-md text-gray-700 hover:bg-gray-100',
              onClick: () => {
                if (this.type === 'year') {
                  this.setYear(this.selectedYear - 3, false);
                }
                if (this.type === 'month' || this.type === 'quarter' || this.type === 'half-year') {
                  this.setYear(this.selectedYear - 1, false);
                }
                if (this.type === 'date') {
                  this.setPrevMonthDate();
                }
              },
            },
            [h(ChevronLeftIcon, { class: 'h-5 w-5 text-gray-700' })]
          ),
          this.type === 'date'
            ? h('div', { class: 'relative' }, [
                h(
                  'button',
                  {
                    class: 'transition duration-150 font-semibold hover:bg-gray-100 p-1 px-3 rounded-md',
                    onClick: () => (this.showMonthYearDropdown = !this.showMonthYearDropdown),
                  },
                  [
                    h('span', { class: 'flex items-center' }, [
                      this.headerTitle,
                      h(ChevronDownIcon, {
                        class: [
                          'transform ease-in-out duration-150 w-5 h-5 ml-1',
                          {
                            'rotate-180': this.showMonthYearDropdown,
                          },
                        ],
                      }),
                    ]),
                  ]
                ),
                h(
                  Transition,
                  {
                    enterActiveClass: 'transition ease-out duration-100',
                    enterFromClass: 'transform opacity-0 scale-95',
                    enterToClass: 'transform opacity-100 scale-100',
                    leaveActiveClass: 'transition ease-in duration-75',
                    leaveFromClass: 'transform opacity-100 scale-100',
                    leaveToClass: 'transform opacity-0 scale-95',
                  },
                  {
                    default: () =>
                      this.showMonthYearDropdown
                        ? h(
                            'div',
                            {
                              class:
                                'transition duration-150 w-full absolute flex justify-center mt-1 py-2 border-2 border-gray-200 rounded-md bg-white shadow-lg mx-auto',
                            },
                            [
                              h('div', { class: 'grid grid-cols-2 items-center justify-center' }, [
                                h(
                                  'div',
                                  {
                                    class: 'max-h-48 overflow-x-hidden overflow-y-auto border-r-2 border-gray-200 px-2',
                                  },
                                  [
                                    shortMonths.map((month, index) =>
                                      h(
                                        'button',
                                        {
                                          class: [
                                            'p-0.5',
                                            index + 1 === this.currentMonth
                                              ? 'text-' + uiConfig.primaryTextColor + '-600 font-bold'
                                              : 'text-gray-700 hover:text-gray-900',
                                          ],
                                          onClick: () => this.setMonth(index, false),
                                        },
                                        capitalize(month)
                                      )
                                    ),
                                  ]
                                ),
                                h('div', { class: 'max-h-48 overflow-x-hidden overflow-y-auto px-2' }, [
                                  this.yearsToSelect.map(year =>
                                    h(
                                      'button',
                                      {
                                        class: [
                                          'p-0.5',
                                          year === this.selectedYear
                                            ? 'text-' + uiConfig.primaryTextColor + '-600 font-bold'
                                            : 'text-gray-700 hover:text-gray-900',
                                        ],
                                        onClick: () => this.setYear(year, false),
                                      },
                                      year
                                    )
                                  ),
                                ]),
                              ]),
                            ]
                          )
                        : null,
                  }
                ),
              ])
            : h(
                'span',
                { class: 'font-semibold p-1 px-3 rounded-md' },
                this.type === 'year' ? this.currentYear : this.selectedYear
              ),

          h(
            'button',
            {
              class: 'p-2 transition duration-150 rounded-md text-gray-700 hover:bg-gray-100',
              onClick: () => {
                if (this.type === 'year') {
                  this.setYear(this.selectedYear + 3, false);
                }
                if (this.type === 'month' || this.type === 'quarter' || this.type === 'half-year') {
                  this.setYear(this.selectedYear + 1, false);
                }
                if (this.type === 'date') {
                  this.setNextMonthDate();
                }
                // this.type !== 'date' ? this.setNextYear() : this.setNextMonthDate();
              },
            },
            [h(ChevronRightIcon, { class: 'h-5 w-5 text-gray-700' })]
          ),
        ]
      ),

      this.type === 'date'
        ? h('div', { class: 'grid grid-cols-7 gap-1' }, [
            shortWeeks.map(weekDay => h('span', { class: 'text-gray-400 p-2 w-auto text-center' }, weekDay)),
          ])
        : null,
      this.renderPickerTemplateByType(),
    ]);
  },
});
