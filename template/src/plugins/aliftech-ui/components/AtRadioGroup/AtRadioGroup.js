import "./AtRadioGroup.scss";

import { h } from "vue";
import {
  RadioGroup,
  RadioGroupDescription,
  RadioGroupLabel,
  RadioGroupOption,
} from "@headlessui/vue";

import { generatorId } from "../../utils";
import { uiConfig } from "../../index";

const AtRadioGroup = (props, { emit, slots }) => {
  return h(
    RadioGroup,
    {
      modelValue: props.modelValue,
      "onUpdate:modelValue": (value) => emit("update:modelValue", value),
    },
    {
      default: () =>
        h(
          "div",
          {
            class: ["bg-white rounded-md -space-y-px", { flex: props.inline }],
          },
          [
            props.items.map((item, itemIdx) => {
              return h(
                RadioGroupOption,
                {
                  as: "template",
                  value: item[props.valueType],
                  class: [{ "mr-5": props.inline }],
                },
                {
                  default: ({ checked, active }) => {
                    return h(
                      "div",
                      {
                        class: [
                          itemIdx === 0 ? "rounded-tl-md rounded-tr-md" : "",
                          itemIdx === props.items.length - 1
                            ? "rounded-bl-md rounded-br-md"
                            : "",
                          checked
                            ? (props.noBorder
                                ? ""
                                : "bg-" +
                                  uiConfig.primaryBackgroundColor +
                                  "-50 ") +
                              "border-" +
                              uiConfig.primaryBorderColor +
                              "-200 " +
                              "z-10"
                            : "border-gray-200",
                          "relative flex cursor-pointer focus:outline-none",
                          {
                            "pb-4": !props.inline,
                            "border px-4 pt-4": !props.noBorder,
                            "border-red-300 form-radio--error": props.error,
                            "border-green-500 form-radio--success":
                              props.success,
                          },
                        ],
                      },
                      [
                        h(
                          "span",
                          {
                            class: [
                              checked
                                ? "bg-" +
                                  uiConfig.primaryBackgroundColor +
                                  "-600 border-transparent"
                                : "bg-white border-gray-300",
                              active
                                ? "ring-2 ring-offset-2 ring-" +
                                  uiConfig.primaryBorderColor +
                                  "-500"
                                : "",
                              "h-4 w-4 mt-0.5 mr-3 cursor-pointer rounded-full border flex items-center justify-center",
                              {
                                "border-red-300 form-radio--error": props.error,
                                "border-green-500 form-radio--success":
                                  props.success,
                              },
                            ],
                            "aria-hidden": true,
                          },
                          [
                            h("span", {
                              class: "rounded-full bg-white w-1.5 h-1.5",
                            }),
                          ]
                        ),
                        "item" in slots
                          ? slots.item({ item })
                          : h("div", { class: "flex flex-col" }, [
                              item.title
                                ? h(
                                    RadioGroupLabel,
                                    {
                                      as: "span",
                                      class: [
                                        checked
                                          ? "text-" +
                                            uiConfig.primaryTextColor +
                                            "-900"
                                          : "text-gray-900",
                                        "block text-sm font-medium",
                                      ],
                                    },
                                    { default: () => item.title }
                                  )
                                : null,
                              item.subtitle
                                ? h(
                                    RadioGroupDescription,
                                    {
                                      as: "span",
                                      class: [
                                        checked
                                          ? "text-" +
                                            uiConfig.primaryTextColor +
                                            "-700"
                                          : "text-gray-500",
                                        "block text-sm",
                                      ],
                                    },
                                    { default: () => item.subtitle }
                                  )
                                : null,
                            ]),
                      ]
                    );
                  },
                }
              );
            }),
          ]
        ),
    }
  );
};

AtRadioGroup.props = {
  id: { type: String, default: () => generatorId("at-radio-") },
  valueType: { type: String, default: "value" },
  items: { type: Array, required: true },
  noBorder: { type: Boolean, default: false },
  modelValue: {},
  inline: { type: Boolean, default: false },
  error: { type: [Boolean, String, Number], default: false },
  success: { type: [Boolean, String, Number], default: false },
  disabled: { type: [Boolean, String, Number], default: false },
};
AtRadioGroup.emits = ["update:modelValue"];

export default AtRadioGroup;
