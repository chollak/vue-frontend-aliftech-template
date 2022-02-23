import {
  h,
  ref,
  defineComponent,
  withDirectives,
  resolveDirective,
  defineAsyncComponent,
} from "vue";
import { generatorId } from "../../utils";
import { ExclamationCircleIcon } from "@heroicons/vue/solid/esm";
import { setIcon } from "./methods/setIcon";
import { uiConfig } from "../../install";

import AtInputAddOn from "../AtInputAddOn/AtInputAddOn";

import {
  getInputHelpType,
  setInputBorderClass,
} from "../../utils/componentsSameFunctions/forms";
import { setInputEvents } from "../../mixins/events/InputEvents";
import { InputEventsTypes } from "../../constants/InputEvents";

import "./AtInput.scss";
import AtInputHelp from "../AtInputHelp/AtInputHelp";

import { maska } from "../../utils/maska";
import InputElements from "../../mixins/props/InputElements";
const AtInputLabel = defineAsyncComponent(() =>
  import("../AtInputLabel/AtInputLabel")
);

export default defineComponent({
  name: "AtInput",
  emits: ["update:modelValue", "trailingButtonClick"].concat(InputEventsTypes),
  props: {
    ...InputElements.props,
    id: { type: String, default: () => generatorId("at-input-") },
    modelValue: { type: [String, Number, Date], default: "" },
    label: { type: String, default: "" },
    type: { type: String, default: "text" },
    name: { type: String, default: "" },
    placeholder: { type: String, default: "" },
    helpText: { type: String, default: "" },
    hint: { type: String, default: "" },
    addOn: { type: String, default: "" },
    addOnBeforeSelect: { type: Boolean, default: false },
    addOnAfterSelect: { type: Boolean, default: false },
    iconBefore: { type: [String, Object], default: () => "" },
    iconAfter: { type: [String, Object], default: () => "" },
    mask: { type: String, default: "" },
  },
  directives: { maska },
  setup(props, { slots }) {
    const addOnRef = ref(null);
    const addOnBeforeExist = "addOnBefore" in slots;
    const addOnAfterExist = "addOnAfter" in slots;
    const trailingButtonExist = "trailingButton" in slots;
    const maskDirective = resolveDirective("maska");

    return {
      maskDirective,
      addOnRef,
      addOnBeforeExist,
      addOnAfterExist,
      trailingButtonExist,
    };
  },
  render() {
    const inputEl = h("input", {
      class: [
        "transition duration-200 shadow-sm block w-full sm:text-sm",
        setInputBorderClass(this.error, this.success),
        {
          "rounded-md":
            !this.addOnBeforeExist &&
            !this.addOnAfterExist &&
            !this.trailingButtonExist,
          "rounded-none rounded-r-md":
            this.addOnBeforeExist &&
            !this.addOnAfterExist &&
            !this.trailingButtonExist,
          "rounded-none rounded-l-md":
            (this.addOnAfterExist || this.trailingButtonExist) &&
            !this.addOnBeforeExist,
          "pl-10": this.iconBefore,
          "pr-10": this.iconAfter,
        },
      ],
      style: this.addOnRef
        ? `padding-left: ${this.addOnRef.clientWidth + 4 || 16}px`
        : undefined,
      name: this.name,
      placeholder: this.placeholder,
      id: this.id,
      type: this.type,
      disabled: this.disabled,
      value: this.modelValue,
      ...setInputEvents(this.$emit),
      onFocus: () => this.$emit("update:onFocus"),
      onInput: (event) =>
        this.$emit(
          "update:modelValue",
          this.mask
            ? event.target.value.replaceAll(" ", "")
            : event.target.value
        ),
    });
    return h("div", [
      h("div", { class: "flex justify-between items-center" }, [
        // Input label
        "label" in this.$slots
          ? this.$slots.label()
          : this.label
          ? h(AtInputLabel, null, { default: () => this.label })
          : null,

        // Hint
        this.hint
          ? h(
              "span",
              { class: "text-sm text-gray-500", id: `${this.id}-optional` },
              this.hint
            )
          : null,
      ]),
      h(
        "div",
        {
          class: [
            {
              "relative rounded-md shadow-sm":
                this.error || this.iconAfter || this.iconBefore || this.addOn,
              flex:
                this.addOnBeforeExist ||
                this.trailingButtonExist ||
                this.addOnAfterExist,
            },
          ],
        },
        [
          // Icon before input
          this.iconBefore ? setIcon(this.iconBefore, "left") : null,

          // Inline addOn
          this.addOn
            ? h(
                "div",
                {
                  class:
                    "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none",
                  ref: this.addOnRef,
                },
                [h("span", { class: "text-gray-500 sm:text-sm" }, this.addOn)]
              )
            : null,

          // AddOn on left side
          this.addOnBeforeExist
            ? h(
                AtInputAddOn,
                { select: this.addOnBeforeSelect },
                { default: () => this.$slots.addOnBefore() }
              )
            : null,

          // Input element
          h("div", { class: "relative w-full" }, [
            this.mask
              ? withDirectives(inputEl, [[this.maskDirective, this.mask]])
              : inputEl,
            this.error
              ? h(
                  "div",
                  {
                    class: [
                      "absolute inset-y-0 right-0 flex items-center pointer-events-none",
                      this.iconAfter ? "pr-9" : "pr-3",
                    ],
                  },
                  [
                    h(ExclamationCircleIcon, {
                      class: "h-5 w-5 text-red-500",
                      "aria-hidden": true,
                    }),
                  ]
                )
              : null,
          ]),

          this.trailingButtonExist
            ? h(
                "button",
                {
                  type: "button",
                  class:
                    "-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-" +
                    uiConfig.primaryBorderColor +
                    "-500 focus:border-" +
                    uiConfig.primaryBorderColor +
                    "-500",
                  onClick: () => {
                    this.$emit("trailingButtonClick");
                  },
                },
                this.$slots.trailingButton?.()
              )
            : null,

          // AddOn after input
          this.addOnAfterExist
            ? h(
                AtInputAddOn,
                { select: this.addOnAfterSelect, side: "right" },
                { default: () => this.$slots.addOnAfter() }
              )
            : null,

          // Icon after input
          this.iconAfter ? setIcon(this.iconAfter, "right") : null,
        ]
      ),

      // Error message and help text printing
      this.error || this.helpText
        ? h(
            AtInputHelp,
            { type: getInputHelpType(this.error, this.success) },
            { default: () => this.helpText || this.error }
          )
        : null,
    ]);
  },
});
