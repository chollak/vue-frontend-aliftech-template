import { h } from "vue";
import { getColor } from "./methods/getColor";
import { getSize } from "./methods/getSize";
import AtLoading from "../AtLoading/AtLoading";
import { transformToBool, getIconComponent } from "../../utils";
import RouterLocation from "../../validations/RouterLocation";
import { RouterLink } from "vue-router";

const AtButton = (props, context) => {
  const disabledState =
    props.loading || transformToBool(context.attrs.disabled);

  const componentProps = {
    ...context.attrs,
    class: [
      { "pointer-events-none": props.loading },
      getColor(
        props.color,
        props.loading,
        transformToBool(context.attrs.disabled)
      ),
      getSize(props.size),
      props.block ? "flex w-full" : "inline-flex",
      "justify-center items-center border font-medium rounded-md focus:outline-none transition ease-in-out duration-150",
    ].concat(["class" in context.attrs ? context.attrs.class : ""], {
      "cursor-default": context.attrs?.disabled ?? false,
    }),
  };

  if (props.to) {
    componentProps.to = props.to;
  }
  if (disabledState) {
    componentProps.disabled = disabledState;
  }

  return h(props.to ? RouterLink : "button", componentProps, {
    default: () => [
      props.loading
        ? h(AtLoading, {
            color: props.color,
            size: props.size,
            class: "mr-3",
          })
        : null,
      props.icon
        ? h(
            "span",
            {
              class: [
                "inline-block align-middle",
                {
                  "mr-1": props.size === "xs" || props.size === "sm",
                  "mr-2": props.size !== "xs" && props.size !== "sm",
                },
              ],
            },
            [
              h(getIconComponent(props.icon).Icon, {
                class: [
                  props.size === "xs"
                    ? "h-3.5"
                    : props.size === "md" || props.size === "lg"
                    ? "h-5"
                    : "h-4",
                ],
              }),
            ]
          )
        : null,
      h(
        "span",
        { class: "align-middle" },
        "default" in context.slots ? context.slots.default() : "Button"
      ),
    ],
  });
};

AtButton.props = {
  to: {
    type: [Object, String],
    validator: (to) => RouterLocation(to),
    default: "",
  },
  color: { type: String, default: "white" },
  size: { type: String, default: "md" },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  icon: { type: [String, Object], default: () => "" },
};

export default AtButton;
