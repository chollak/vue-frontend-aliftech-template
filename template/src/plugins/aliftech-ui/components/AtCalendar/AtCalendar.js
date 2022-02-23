import {
  h,
  ref,
  computed,
  watch,
  Transition,
  capitalize,
  toRefs,
  defineComponent,
} from "vue";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/outline/esm";
import { ChevronDownIcon } from "@heroicons/vue/solid/esm";
import { short as shortWeeks } from "../../constants/weeks";
import {
  full as fullMonths,
  short as shortMonths,
} from "../../constants/months";
import { uiConfig } from "../../index";

export default defineComponent({
  name: "AtCalendar",
  emits: ["update:modelValue"],
  props: {
    modelValue: { type: [String, Date, Array], default: new Date() },
    format: { default: "dd/mm/yyyy" },
    range: { type: Boolean, default: false },
    type: {
      type: String,
      default: "date",
      validator: (value) => {
        return value === "date" || value === "month" || value === "year";
      },
    },
  },
  setup(props, { emit }) {
    //// Properties
    let currentMonth = ref(new Date().getMonth() + 1);
    let selectedMonth = ref(new Date().getMonth() + 1);
    let selectedYear = ref(new Date().getFullYear());
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
      selectedYear.value = new Date(props.modelValue).getFullYear();
      selectedDay.value = new Date(props.modelValue).getDate();
    } else if (props.range && value.value.length === 2) {
      dateRange.value = value.value;
      currentMonth.value = new Date(dateRange.value[0]).getMonth() + 1;
      selectedMonth.value = new Date(dateRange.value[0]).getMonth() + 1;
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
      const prevMonthDate = new Date(
        selectedYear.value,
        currentMonth.value - 1,
        0
      ).getDate();
      for (let i = 0; i < monthDays.value[0].weekDay - 1; i++) {
        days.unshift(prevMonthDate - i);
      }
      return days.map((day) =>
        h(
          "button",
          {
            class:
              "transition duration-150 text-gray-300 p-2 w-auto text-center hover:text-gray-400",
            onClick: () => setPrevMonthDate(day),
          },
          day
        )
      );
    });

    /**
     * Get days after last day of current month to print
     * @type {ComputedRef<VNode<RendererNode, RendererElement, {[p: string]: any}>[]>}
     */
    const daysAfterCurrentMonthDays = computed(() => {
      let days = [];
      for (
        let i = 0;
        i < 7 - monthDays.value[monthDays.value.length - 1].weekDay;
        i++
      ) {
        days.push(i + 1);
      }
      return days.map((day) =>
        h(
          "button",
          {
            class:
              "transition duration-150 text-gray-300 p-2 w-auto text-center hover:text-gray-400",
            onClick: () => setNextMonthDate(day),
          },
          day
        )
      );
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

    //// Watchers
    if (props.range) {
      watch(
        dateRange,
        () => {
          if (dateRange.value.length === 2) {
            if (new Date(dateRange.value[0]) > new Date(dateRange.value[1])) {
              dateRange.value = dateRange.value.reverse();
            }
            emit("update:modelValue", dateRange.value);
            // let days = dateRange.value[1] - dateRange.value[0];
          }
        },
        { deep: true }
      );
    } else {
      watch([selectedDay, selectedYear, selectedMonth], () => {
        emit(
          "update:modelValue",
          new Date(
            selectedYear.value,
            currentMonth.value - 1,
            selectedDay.value
          )
        );
      });
    }

    //// Watchers - END

    //// Internal handlers
    /**
     * Return the day week number
     * @param {number} date
     * @returns {number|number}
     */
    const getDayOfDate = (date) => {
      const weekDay = new Date(
        selectedYear.value,
        currentMonth.value - 1,
        date
      ).getDay();
      return weekDay || 7;
    };

    /**
     * Get current month days count
     */
    const getCurrentMonthDays = () => {
      let daysInMonth = new Date(
        selectedYear.value,
        currentMonth.value,
        0
      ).getDate();
      let days = [];

      for (let day = 1; day <= daysInMonth; day++) {
        days.push({
          weekDay: getDayOfDate(day),
          date: day,
        });
      }

      monthDays.value = days;
    };

    const getPickerButtonClasses = (condition) =>
      condition
        ? "bg-" + uiConfig.primaryBackgroundColor + "-600 text-white"
        : "text-gray-700 hover:bg-gray-100 active:bg-gray-300";
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
     */
    const setMonth = (month) => {
      if (currentMonth.value !== month + 1) {
        currentMonth.value = month + 1;
        selectedMonth.value = month + 1;
        showMonthYearDropdown.value = false;
        getCurrentMonthDays();
      }
    };

    /**
     * Set current year from year selector
     * @param {number} year
     */
    const setYear = (year) => {
      if (selectedYear.value !== year) {
        selectedYear.value = year;
        showMonthYearDropdown.value = false;
        getCurrentMonthDays();
      }
    };

    /**
     * Select day
     * @param {Object} day
     */
    const setCurrentDateDay = (day) => {
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

    const checkDayBetweenDateRange = (day) => {
      const date = new Date(
        selectedYear.value,
        currentMonth.value - 1,
        day.date
      );
      return (
        date > new Date(dateRange.value[0]) &&
        date.getMonth() === currentMonth.value - 1 &&
        date < new Date(dateRange.value[1]) &&
        date.getMonth() === currentMonth.value - 1
      );
    };

    const renderPickerTemplateByType = () => {
      if (props.type === "date") {
        return h("div", { class: "grid grid-cols-7 gap-1" }, [
          daysBeforeCurrentMonthDays.value,
          monthDays.value.map((day) => {
            return h(
              "button",
              {
                class: [
                  "transition duration-150 p-1 w-auto text-center rounded-md",
                  getPickerButtonClasses(
                    props.range
                      ? dateRange.value.some(
                          (date) =>
                            date.getDate() === day.date &&
                            date.getMonth() + 1 === currentMonth.value
                        )
                      : day.date === selectedDay.value &&
                          selectedMonth.value === currentMonth.value
                  ),
                  checkDayBetweenDateRange(day)
                    ? "bg-" + uiConfig.primaryBackgroundColor + "-100"
                    : "",
                ],
                onClick: () => {
                  props.range
                    ? setDateRange(
                        day,
                        currentMonth.value - 1,
                        selectedYear.value
                      )
                    : setCurrentDateDay(day);
                },
              },
              day.date
            );
          }),
          daysAfterCurrentMonthDays.value,
        ]);
      } else if (props.type === "month") {
        return h("div", { class: "grid grid-cols-3 gap-1" }, [
          fullMonths.map((month, index) => {
            return h(
              "button",
              {
                class: [
                  "transition duration-150 p-1 w-auto text-center rounded-md",
                  getPickerButtonClasses(index + 1 === currentMonth.value),
                ],
                onClick: () => setMonth(index),
              },
              capitalize(month)
            );
          }),
        ]);
      } else {
        const years = [];
        const currentYear = new Date().getFullYear();
        for (let i = -5; i < 5; i++) {
          years.push(currentYear + i);
        }
        return h("div", { class: "grid grid-cols-3 gap-1" }, [
          years.map((year) => {
            return h(
              "button",
              {
                class: [
                  "transition duration-150 p-1 w-auto text-center rounded-md",
                  getPickerButtonClasses(year === selectedYear.value),
                ],
                onClick: () => setYear(year),
              },
              year
            );
          }),
        ]);
      }
    };
    //// External handles - END

    getCurrentMonthDays();

    return {
      monthDays,
      selectedDay,
      selectedYear,
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
    return h("div", { class: "block w-full h-full" }, [
      this.type === "date"
        ? h(
            "div",
            {
              class:
                "flex justify-between items-center h-12 border-b-2 border-gray-200 mb-1",
            },
            [
              h(
                "button",
                {
                  class:
                    "p-2 transition duration-150 rounded-md text-gray-700 hover:bg-gray-100",
                  onClick: () => this.setPrevMonthDate(),
                },
                [h(ChevronLeftIcon, { class: "h-5 w-5 text-gray-700" })]
              ),
              this.type === "date"
                ? h("div", { class: "relative" }, [
                    h(
                      "button",
                      {
                        class:
                          "transition duration-150 font-semibold hover:bg-gray-100 p-1 px-3 rounded-md",
                        onClick: () =>
                          (this.showMonthYearDropdown =
                            !this.showMonthYearDropdown),
                      },
                      [
                        h("span", { class: "flex items-center" }, [
                          this.headerTitle,
                          h(ChevronDownIcon, {
                            class: [
                              "transform ease-in-out duration-150 w-5 h-5 ml-1",
                              {
                                "rotate-180": this.showMonthYearDropdown,
                              },
                            ],
                          }),
                        ]),
                      ]
                    ),
                    h(
                      Transition,
                      {
                        enterActiveClass: "transition ease-out duration-100",
                        enterFromClass: "transform opacity-0 scale-95",
                        enterToClass: "transform opacity-100 scale-100",
                        leaveActiveClass: "transition ease-in duration-75",
                        leaveFromClass: "transform opacity-100 scale-100",
                        leaveToClass: "transform opacity-0 scale-95",
                      },
                      {
                        default: () =>
                          this.showMonthYearDropdown
                            ? h(
                                "div",
                                {
                                  class:
                                    "transition duration-150 w-full absolute flex justify-center mt-1 py-2 border-2 border-gray-200 rounded-md bg-white shadow-lg mx-auto",
                                },
                                [
                                  h(
                                    "div",
                                    {
                                      class:
                                        "grid grid-cols-2 items-center justify-center",
                                    },
                                    [
                                      h(
                                        "div",
                                        {
                                          class:
                                            "max-h-48 overflow-y-auto border-r-2 border-gray-200 px-2",
                                        },
                                        [
                                          shortMonths.map((month, index) =>
                                            h(
                                              "button",
                                              {
                                                class: [
                                                  "p-0.5",
                                                  index + 1 ===
                                                  this.currentMonth
                                                    ? "text-" +
                                                      uiConfig.primaryTextColor +
                                                      "-600 font-bold"
                                                    : "text-gray-700 hover:text-gray-900",
                                                ],
                                                onClick: () =>
                                                  this.range
                                                    ? null
                                                    : this.setMonth(index),
                                              },
                                              capitalize(month)
                                            )
                                          ),
                                        ]
                                      ),
                                      h(
                                        "div",
                                        {
                                          class:
                                            "max-h-48 overflow-y-auto px-2",
                                        },
                                        [
                                          this.yearsToSelect.map((year) =>
                                            h(
                                              "button",
                                              {
                                                class: [
                                                  "p-0.5",
                                                  year === this.selectedYear
                                                    ? "text-" +
                                                      uiConfig.primaryTextColor +
                                                      "-600 font-bold"
                                                    : "text-gray-700 hover:text-gray-900",
                                                ],
                                                onClick: () =>
                                                  this.range
                                                    ? null
                                                    : this.setYear(year),
                                              },
                                              year
                                            )
                                          ),
                                        ]
                                      ),
                                    ]
                                  ),
                                ]
                              )
                            : null,
                      }
                    ),
                  ])
                : h(
                    "span",
                    { class: "font-semibold p-1 px-3 rounded-md" },
                    this.headerTitle
                  ),

              h(
                "button",
                {
                  class:
                    "p-2 transition duration-150 rounded-md text-gray-700 hover:bg-gray-100",
                  onClick: () => this.setNextMonthDate(),
                },
                [h(ChevronRightIcon, { class: "h-5 w-5 text-gray-700" })]
              ),
            ]
          )
        : null,

      this.type === "date"
        ? h("div", { class: "grid grid-cols-7 gap-1" }, [
            shortWeeks.map((weekDay) =>
              h(
                "span",
                { class: "text-gray-400 p-2 w-auto text-center" },
                weekDay
              )
            ),
          ])
        : null,
      this.renderPickerTemplateByType(),
    ]);
  },
});
