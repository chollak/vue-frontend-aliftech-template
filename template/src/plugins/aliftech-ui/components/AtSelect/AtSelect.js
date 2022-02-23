import { h, ref, Transition } from "vue";
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { SelectorIcon } from "@heroicons/vue/solid";
import { uiConfig } from "../../install";
import AtInputHelp from "~/plugins/aliftech-ui/components/AtInputHelp/AtInputHelp";
import {
  getInputHelpType,
  setInputBorderClass,
} from "~/plugins/aliftech-ui/utils/componentsSameFunctions/forms";
import InputElements from "~/plugins/aliftech-ui/mixins/props/InputElements";

const AtSelect = (props, ctx) => {
  let selectedItem = ref(props.modelValue || "");
  return h("div", [
    h(
      Listbox,
      { as: "div", modelValue: selectedItem.value, disabled: props.disabled },
      {
        default: () => [
          h(
            ListboxLabel,
            { class: "block text-sm font-medium text-gray-700 mb-1" },
            {
              default: () =>
                "label" in ctx.slots ? ctx.slot.label : props.label,
            }
          ),
          h("div", { class: "relative" }, [
            h(
              ListboxButton,
              {
                class: [
                  props.beforeInput ? "" : "border border-gray-300 shadow-sm",
                  "rounded-md cursor-pointer bg-white relative w-full min-w-20 pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-" +
                    uiConfig.primaryBorderColor +
                    "-500 focus:border-" +
                    uiConfig.primaryBorderColor +
                    "-500 sm:text-sm",
                  setInputBorderClass(props.error, props.success),
                ],
              },
              {
                default: () => [
                  h("div", { class: "flex items-center" }, [
                    selectedItem.value?.avatar
                      ? h("img", {
                          src: selectedItem.value?.avatar,
                          class: "flex-shrink-0 h-6 w-6 rounded-full",
                        })
                      : null,
                    h(
                      "span",
                      {
                        class: [
                          "block truncate",
                          selectedItem.value?.avatar ? "ml-2" : "",
                        ],
                      },
                      [
                        props.valueType
                          ? props.options.find(
                              (option) =>
                                option[props.valueType] === selectedItem.value
                            )?.title ?? props.placeholder
                          : selectedItem.value.title || props.placeholder,
                      ]
                    ),
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
                ],
              }
            ),
            h(
              Transition,
              {
                leaveActiveClass: "transition ease-in duration-100",
                leaveFromClass: "opacity-100",
                leaveToClass: "opacity-0",
              },
              {
                default: () =>
                  h(
                    ListboxOptions,
                    {
                      class:
                        "absolute z-10 mt-1 w-full min-w-20 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm",
                    },
                    {
                      default: () =>
                        props.options.map((item) =>
                          h(
                            ListboxOption,
                            { as: "template", value: item.value },
                            {
                              default: () =>
                                h(
                                  "li",
                                  {
                                    class: [
                                      item.value ===
                                      (props.valueType
                                        ? selectedItem.value
                                        : selectedItem.value.value)
                                        ? "text-white bg-" +
                                          uiConfig.primaryBackgroundColor +
                                          "-600"
                                        : "text-gray-900",
                                      "cursor-pointer select-none relative py-2 pl-3 pr-9",
                                    ],
                                    onClick: () => {
                                      ctx.emit(
                                        "update:modelValue",
                                        props.valueType
                                          ? item[props.valueType]
                                          : item
                                      );
                                      ctx.emit(
                                        "change",
                                        props.valueType
                                          ? item[props.valueType]
                                          : item
                                      );
                                    },
                                  },
                                  [
                                    item.value === selectedItem.value.value
                                      ? h("span", {
                                          class: [
                                            item.value ===
                                            selectedItem.value.value
                                              ? "text-white"
                                              : "text-" +
                                                uiConfig.primaryTextColor +
                                                "-600",
                                            "absolute inset-y-0 right-0 flex items-center pr-4",
                                          ],
                                        })
                                      : "",
                                    h("div", { class: "flex items-center" }, [
                                      item?.avatar
                                        ? h("img", {
                                            src: item?.avatar,
                                            class:
                                              "flex-shrink-0 h-6 w-6 rounded-full",
                                          })
                                        : "",
                                      h(
                                        "span",
                                        {
                                          class: [
                                            item.value ===
                                            selectedItem.value.value
                                              ? "font-semibold"
                                              : "font-normal",
                                            "ml-3 block truncate",
                                          ],
                                        },
                                        [item.title]
                                      ),
                                    ]),
                                  ]
                                ),
                            }
                          )
                        ),
                    }
                  ),
              }
            ),
          ]),
        ],
      }
    ),
    props.error
      ? h(
          AtInputHelp,
          { type: getInputHelpType(props.error, props.success) },
          { default: () => props.error }
        )
      : null,
  ]);
};

AtSelect.props = {
  ...InputElements.props,
  modelValue: { type: [Object, String, Number], default: () => {} },
  valueType: { type: String, default: "value" },
  label: { type: String, default: "" },
  beforeInput: { type: Boolean, default: false },
  placeholder: { type: String, default: "Выберите значение" },
  options: {
    type: Array,
    validator: (options) =>
      options.every(
        (option) =>
          Object.prototype.toString.call(option) === "[object Object]" &&
          "title" in option &&
          "value" in option
      ),
  },
};

AtSelect.emits = ["change", "update:modelValue"];

export default AtSelect;
