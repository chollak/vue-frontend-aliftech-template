import { h } from "vue";
import { uiConfig } from "../../../";

const PaginationLink = (props, ctx) => {
  return h(
    "button",
    Object.assign({}, ctx.attrs, {
      class: [
        "items-center py-2 relative border text-sm leading-5 font-medium ease-in-out duration-150 transition",
        "focus:shadow-outline-" + uiConfig.primaryBoxShadowColor,
        "focus:outline-none focus:z-10 cursor-pointer",
        props.selected
          ? [
              "border-" + uiConfig.primaryBorderColor + "-600",
              "bg-" + uiConfig.primaryBackgroundColor + "-600",
              "text-white",
            ]
          : [
              "border-gray-300 bg-white active:bg-gray-100",
              "focus:border-" + uiConfig.primaryBorderColor + "-300",
              "active:text-gray-700 hover:text-gray-500 text-gray-700",
            ],
      ].concat(
        "class" in ctx.attrs ? ctx.attrs.class : "",
        "staticClass" in ctx.attrs ? ctx.data.staticClass : ""
      ),
    }),
    "default" in ctx.slots ? ctx.slots.default() : null
  );
};

PaginationLink.props = {
  selected: { type: Boolean, required: true },
};

export default PaginationLink;
