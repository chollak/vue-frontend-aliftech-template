import "./AtCheckbox.scss";

import { h } from "vue";
import { transformToBool, generatorId } from "../../utils";
import { uiConfig } from "../../";
import InputElements from "../../mixins/props/InputElements";

import AtSwitch from "../AtSwitch/AtSwitch";

const AtCheckbox = (props, context) => {
  return h(
    "div",
    {
      class: ["block w-full"].concat(
        "class" in context.attrs ? context.attrs.class : {}
      ),
    },
    [
      h("div", { class: "relative flex items-start" }, [
        h("div", { class: "flex items-center h-5" }, [
          h("input", {
            class: [
              "border-gray-300 rounded form-checkbox h-4 w-4 transition duration-150 ease-in-out cursor-pointer",
              "text-" + uiConfig.primaryTextColor + "-600",
              "focus:ring-" + uiConfig.primaryBoxShadowColor + "-500",
              "focus:shadow-outline-" + uiConfig.primaryBoxShadowColor,
              "focus:border-" + uiConfig.primaryBorderColor + "-300",
              {
                "border-red-300 form-checkbox--error": transformToBool(
                  props.error
                ),
                "border-green-500 form-checkbox--success": transformToBool(
                  props.success
                ),
              },
            ],
            type: "checkbox",
            checked: transformToBool(props.modelValue),
            disabled: transformToBool(props.disabled),
            id: props.id,
            onInput: (e) => {
              e.stopPropagation();
              if (
                "target" in e &&
                Object.prototype.toString.call(e.target) ===
                  "[object HTMLInputElement]" &&
                "checked" in e.target
              ) {
                context.emit("update:modelValue", e.target.checked);
              }
            },
          }),
        ]),
        props.label || "default" in context.slots
          ? h(
              AtSwitch,
              { id: props.id },
              {
                default: () => [
                  props.label,
                  "default" in context.slots
                    ? h(
                        "span",
                        { class: "text-gray-500 block font-normal" },
                        context.slots.default()
                      )
                    : null,
                ],
              }
            )
          : null,
      ]),
    ]
  );
};

AtCheckbox.props = {
  ...InputElements.props,
  id: { type: String, default: () => generatorId("at-checkbox-") },
  modelValue: { type: [Boolean, String, Number], default: false },
};

export default AtCheckbox;
