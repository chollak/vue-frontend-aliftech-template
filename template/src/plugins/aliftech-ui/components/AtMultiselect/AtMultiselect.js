import {
  defineComponent,
  h,
  Transition,
  toRefs,
  ref,
  computed,
  withDirectives,
  resolveDirective,
  defineAsyncComponent,
} from "vue";
import { SelectorIcon } from "@heroicons/vue/solid";
import { CheckIcon, XIcon } from "@heroicons/vue/solid";
import { clickOutside } from "../../mixins/directives/clickOutside";
import { generatorId } from "~/plugins/aliftech-ui/utils";
import {
  getInputHelpType,
  setInputBorderClass,
} from "../../utils/componentsSameFunctions/forms";
import InputElements from "~/plugins/aliftech-ui/mixins/props/InputElements";
import AtInputHelp from "~/plugins/aliftech-ui/components/AtInputHelp/AtInputHelp";
const AtInputLabel = defineAsyncComponent(() =>
  import("../AtInputLabel/AtInputLabel")
);

export default defineComponent({
  name: "AtMultiselect",
  emits: ["update:modelValue", "onScrolledToBottom"],
  props: {
    ...InputElements.props,
    id: { type: String, default: () => generatorId("at-phone-select-") },
    options: { type: Array, default: () => [] },
    valueType: { type: String, default: "value" },
    valuePrint: { type: String, default: "title" },
    placeholder: { type: String, default: "Выберите элементы" },
    searchPlaceholder: { type: String, default: "Поиск по элементам..." },
  },
  directives: { ...clickOutside },
  setup(props, { emit }) {
    const options = toRefs(props).options;
    let selectedOptions = ref([]);
    let searchText = ref("");
    let showOptionsList = ref(false);
    const clickOutside = resolveDirective("click-outside");

    let sortedOptions = computed(() => {
      return options.value.filter((option) =>
        option[props.valuePrint].includes(searchText.value)
      );
    });

    const colors = [
      "red",
      "green",
      "blue",
      "gray",
      "yellow",
      "pink",
      "purple",
      "indigo",
    ];

    const getRandomBadgeColor = () =>
      colors[Math.floor(Math.random() * (colors.length - 1))];

    const elementClickHandler = (option) => {
      if (
        !selectedOptions.value.some(
          (item) => item?.value === option[props.valueType]
        )
      ) {
        selectedOptions.value.push({
          title: option[props.valuePrint],
          color: getRandomBadgeColor(),
          value: option[props.valueType],
        });
      } else {
        const idx = selectedOptions.value.findIndex(
          (item) => item?.value === option[props.valueType]
        );
        selectedOptions.value.splice(idx, 1);
      }
    };

    const checkIfElementExistInSelectedOptions = (optionValue) =>
      selectedOptions.value.some((item) => item?.value === optionValue);

    const removeElementFromSelectedOptions = (optionIdx) => {
      selectedOptions.value.splice(optionIdx, 1);
    };

    const clickOutsideHandler = () => {
      showOptionsList.value = false;
      emit(
        "update:modelValue",
        selectedOptions.value.map((option) => option?.value)
      );
    };

    return {
      selectedOptions,
      sortedOptions,
      searchText,
      showOptionsList,
      clickOutside,
      clickOutsideHandler,
      elementClickHandler,
      checkIfElementExistInSelectedOptions,
      removeElementFromSelectedOptions,
    };
  },
  render() {
    return withDirectives(
      h("div", { id: this.id, class: "relative" }, [
        h("div", { class: "flex justify-between items-center" }, [
          // Input label
          "label" in this.$slots
            ? this.$slots.label()
            : this.label
            ? h(AtInputLabel, null, { default: () => this.label })
            : null,
        ]),
        h(
          "button",
          {
            type: "button",
            class: [
              "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer",
              setInputBorderClass(this.error, this.success),
            ],
            onClick: () => {
              this.showOptionsList = true;
            },
          },
          [
            h("div", { class: "flex flex-wrap gap-1" }, [
              this.selectedOptions.length
                ? this.selectedOptions.map((option, optionIdx) =>
                    h(
                      "button",
                      {
                        class: [
                          "h-5 px-1 text-xs flex items-center rounded-lg",
                          "bg-" + option?.color + "-100",
                        ],
                      },
                      [
                        option?.title,
                        h(XIcon, {
                          class: "h-3 w-3 ml-1",
                          onClick: () =>
                            this.removeElementFromSelectedOptions(optionIdx),
                        }),
                      ]
                    )
                  )
                : h("span", null, this.placeholder),
            ]),
            h(
              "span",
              {
                class:
                  "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none",
              },
              [
                h(SelectorIcon, {
                  class: "h-5 w-5 text-gray-400",
                  "aria-hidden": true,
                }),
              ]
            ),
          ]
        ),
        h(
          Transition,
          {
            leaveActiveClass: "transition ease-in duration-100",
            leaveFromClass: "opacity-100",
            leaveToClass: "opacity-0",
          },
          {
            default: () => [
              this.showOptionsList
                ? h(
                    "div",
                    {
                      class:
                        "absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md pb-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm",
                    },
                    [
                      h("div", { class: "px-3 py-2 z-40 bg-white w-full" }, [
                        h("input", {
                          type: "search",
                          class:
                            "shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm bg-gray-100 border-0 rounded-md py-1 w-full",
                          placeholder: this.searchPlaceholder,
                          modelValue: this.searchText,
                          onInput: (e) => {
                            this.searchText = e.target.value;
                          },
                        }),
                      ]),
                      h(
                        "ul",
                        {
                          class: "overflow-auto h-full max-h-48",
                          onScroll: (e) => {
                            if (
                              e.target.scrollTop ===
                              e.target.scrollHeight - e.target.offsetHeight
                            ) {
                              this.$emit("onScrolledToBottom");
                            }
                          },
                        },
                        [
                          this.sortedOptions.map((option) =>
                            h(
                              "li",
                              {
                                class: [
                                  this.checkIfElementExistInSelectedOptions(
                                    option[this.valueType]
                                  )
                                    ? "text-white bg-indigo-600"
                                    : "text-gray-900 hover:bg-gray-100",
                                  "cursor-default select-none relative py-2 px-3 cursor-pointer flex items-center justify-between",
                                ],
                                onClick: () => {
                                  this.elementClickHandler(option);
                                },
                              },
                              [
                                h(
                                  "span",
                                  { class: "block" },
                                  option[this.valuePrint]
                                ),
                                this.checkIfElementExistInSelectedOptions(
                                  option[this.valueType]
                                )
                                  ? h(CheckIcon, {
                                      class:
                                        "text-white mr-2 h-4 w-4 inline truncate",
                                    })
                                  : null,
                              ]
                            )
                          ),
                        ]
                      ),
                    ]
                  )
                : null,
            ],
          }
        ),
        // Error message and help text printing
        this.error || this.success
          ? h(
              AtInputHelp,
              { type: getInputHelpType(this.error, this.success) },
              { default: () => this.error || this.success }
            )
          : null,
      ]),
      [[this.clickOutside, this.clickOutsideHandler]]
    );
  },
});
