import { h } from "vue";

import InputElements from "../../mixins/props/InputElements";

import { transformToBool, generatorId } from "../../utils/";
import {
  setInputBorderClass,
  getInputHelpType,
} from "../../utils/componentsSameFunctions/forms";

import AtInputHelp from "../AtInputHelp/AtInputHelp";

import "./AtTextarea.scss";

const AtTextarea = (props, { emit }) => {
  return h("div", [
    props.label
      ? h(
          "label",
          {
            for: props.id,
            class: "block text-sm font-medium text-gray-700 mb-1",
          },
          props.label
        )
      : null,
    h("textarea", {
      id: props.id,
      value: props.modelValue,
      rows: props.rows,
      disabled: props.disabled,
      class: [
        "shadow-sm block w-full sm:text-sm border border-gray-300 rounded-md transition duration-200",
        setInputBorderClass(
          transformToBool(props.error),
          transformToBool(props.success)
        ),
      ],
      onInput: (event) => emit("update:modelValue", event.target.value),
      placeholder: props.placeholder,
    }),
    props.error || props.helpText
      ? h(
          AtInputHelp,
          { type: getInputHelpType(props.error, props.success) },
          { default: () => props.helpText || props.error }
        )
      : null,
  ]);
};

AtTextarea.props = {
  id: { type: String, default: () => generatorId("at-textarea-") },
  modelValue: { type: String, default: "" },
  placeholder: { type: String, default: "" },
  helpText: { type: String, default: "" },
  rows: { type: [Number, String], default: 3 },
  ...InputElements.props,
};

export default AtTextarea;
