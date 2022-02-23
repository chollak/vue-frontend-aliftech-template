import { h, ref, computed, Teleport } from "vue";
import { XIcon } from "@heroicons/vue/solid/esm";

import AtModalTitle from "~/plugins/aliftech-ui/components/AtModalTitle/AtModalTitle";

import { transformToBool } from "../../utils/transformToBool";
import { generatorId } from "../../utils/generatorId";

import "./AtModal.scss";

import { modalDialogSizes } from "../../constants/modalDialogSizes";

let display = ref(false);
let animated = ref(false);
let selectedModal = ref(null);

const AtModal = (props, ctx) => {
  let timeoutAnimation = undefined;

  const toggleVisible = (visible) => {
    if (props.id === selectedModal.value || visible === true) {
      if (visible) {
        display.value = true;
        selectedModal.value = props.id;
      } else {
        animated.value = false;
      }
      if (timeoutAnimation) {
        clearTimeout(timeoutAnimation);
      } else {
        timeoutAnimation = setTimeout(
          () => {
            if (!visible) display.value = false;
            else animated.value = true;
          },
          visible ? 50 : 200
        );
      }
    }
  };

  const slotProps = computed(() => {
    return {
      value: transformToBool(props.modelValue),
      title: props.title,
      description: props.description,
      close: () => {
        toggleVisible(false);
        ctx.emit("update:modelValue", false);
      },
    };
  });

  toggleVisible(transformToBool(props.modelValue));

  return h(
    Teleport,
    { to: "body" },
    h(
      "div",
      {
        class: [
          "fixed inset-0 overflow-y-auto items-center justify-center min-h-screen pt-4 px-4 pb-20 sm:p-0 at-modal z-10",
          {
            "at-modal-display":
              selectedModal.value === props.id ? display.value : false,
            "at-modal-animated":
              selectedModal.value === props.id ? animated.value : false,
          },
        ],
        "at-modal": props.id,
        on: props.events,
      },
      [
        h("div", {
          class: "fixed inset-0 bg-gray-500 at-modal-back",
          onClick: () => {
            toggleVisible(false);
            ctx.emit("update:modelValue", false);
          },
        }),
        h("div", { class: "at-modal-wrapper" }, [
          h(
            "div",
            {
              class: [
                "rounded-lg text-left shadow-xl relative",
                modalDialogSizes[props.size],
                "sm:w-full bg-white",
              ],
            },
            [
              h(
                "div",
                { class: "hidden sm:block absolute top-0 right-0 pt-4 pr-4" },
                [
                  h(
                    "button",
                    {
                      class:
                        "outline-none text-gray-400 hover:text-gray-500 focus:outline-none",
                      onClick: () => {
                        toggleVisible(false);
                        ctx.emit("update:modelValue", false);
                      },
                    },
                    [h(XIcon, { style: [{ width: "24px", height: "24px" }] })]
                  ),
                ]
              ),
              h("div", [
                h(
                  "div",
                  {
                    class: [
                      "text-sm text-gray-500",
                      "footer" in ctx.slots
                        ? "px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                        : "px-4 pt-5 pb-4 sm:p-6",
                    ],
                  },
                  [
                    "title" in ctx.slots
                      ? ctx.$slots.title(slotProps)
                      : props.title
                      ? h(AtModalTitle, {}, { default: () => props.title })
                      : null,
                    "default" in ctx.slots
                      ? h("div", { class: "w-screen max-w-full" }, [
                          ctx.slots?.default(slotProps),
                        ])
                      : props.description
                      ? h("div", { class: "w-screen max-w-full" }, [
                          h("p", props.description),
                        ])
                      : null,
                  ]
                ),
                "footer" in ctx.slots
                  ? h(
                      "div",
                      { class: "bg-gray-50 px-4 py-3 sm:px-6 block" },
                      ctx.slots.footer(slotProps)
                    )
                  : null,
              ]),
            ]
          ),
        ]),
      ]
    )
  );
};

AtModal.props = {
  id: { type: String, default: () => generatorId("at-modal-") },
  modelValue: { type: [Boolean, String, Number], default: false },
  title: { type: String, default: "" },
  description: { type: String, default: "" },
  size: {
    type: String,
    default: "md",
    validator: (size) =>
      Object.prototype.hasOwnProperty.call(modalDialogSizes, size),
  },
};

export default AtModal;
