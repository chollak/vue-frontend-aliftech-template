import { h } from "vue";

const AtInputHelp = (props, context) => {
  return "default" in context.slots
    ? h(
        props.tag,
        Object.assign({}, context.attrs, {
          class: [
            "text-sm",
            props.mt,
            {
              "text-red-600": props.type === "error",
              "text-green-500": props.type === "success",
              "text-gray-600": props.type === "muted",
            },
          ].concat("class" in context.attrs ? context.attrs.class : ""),
        }),
        context.slots.default()
      )
    : null;
};

AtInputHelp.props = {
  tag: { type: String, default: "p" },
  type: {
    type: String,
    default: "muted",
    validator: (type) =>
      type === "normal" ||
      type === "error" ||
      type === "success" ||
      type === "muted",
  },
  mt: { type: [String, Number], default: "mt-1" },
};

export default AtInputHelp;
