import { h } from "vue";
import { generatorId } from "~/plugins/aliftech-ui/utils";
import { uiConfig } from "~/plugins/aliftech-ui";
import AtInputHelp from "~/plugins/aliftech-ui/components/AtInputHelp/AtInputHelp";
import { getInputHelpType } from "~/plugins/aliftech-ui/utils/componentsSameFunctions/forms";

const AtRadioOption = (props, { emit }) => {
  return h("div", [
    h(
      "label",
      {
        class:
          "rounded-tl-md rounded-tr-md relative flex cursor-pointer focus:outline-non",
      },
      [
        h("input", {
          value: props.value,
          checked: props.value === props.modelValue,
          type: "radio",
          class: [
            "h-4 w-4 mt-0.5 cursor-pointer",
            !props.error && !props.success
              ? "text-" +
                uiConfig.primaryTextColor +
                "-600 border-gray-300 focus:ring-" +
                uiConfig.primaryBorderColor +
                "-500"
              : "",
            {
              "border-red-300 text-red-500 focus:ring-red-500": props.error,
              "border-green-500 text-green-500 focus:ring-green-500":
                props.success,
            },
          ],
          name: props.name,
          "aria-labelledby": props.id + "label",
          "aria-describedby": props.id + "description",
          onInput: (e) => {
            e.preventDefault();
            e.stopPropagation();
            emit("update:modelValue", e.target.value);
          },
        }),
        h("div", { class: "ml-3 flex flex-col" }, [
          props.label
            ? h(
                "span",
                {
                  class: [
                    "block text-sm font-medium",
                    props.modelValue === props.value
                      ? "text-" + uiConfig.primaryTextColor + "-900"
                      : "text-gray-900",
                  ],
                  id: props.id + "label",
                },
                props.label
              )
            : null,
          props.description
            ? h(
                "span",
                {
                  class: [
                    "block text-sm",
                    props.modelValue === props.value
                      ? "text-" + uiConfig.primaryTextColor + "-700"
                      : "text-gray-500",
                  ],
                  id: props.id + "description",
                },
                props.description
              )
            : null,
        ]),
      ]
    ),
    props.error
      ? h(
          AtInputHelp,
          { type: getInputHelpType(props.error, props.success), mt: null },
          { default: () => props.error }
        )
      : null,
  ]);
};

AtRadioOption.props = {
  id: { type: String, default: () => generatorId("at-radio-option-") },
  modelValue: { type: [String, Number, Boolean], default: "" },
  value: { type: [String, Number, Boolean], default: "" },
  name: { type: String, default: generatorId("at-radio-option-name") },
  label: { type: String, default: "" },
  description: { type: String, default: "" },
  error: { type: [Boolean, String, Number], default: false },
  success: { type: [Boolean, String, Number], default: false },
  disabled: { type: [Boolean, String, Number], default: false },
};
AtRadioOption.emits = ["update:modelValue"];

export default AtRadioOption;
