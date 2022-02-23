import { h } from "vue";
import { uiConfig } from "../../";
import AtStatsTitle from "../AtStatsTitle/AtStatsTitle";
import AtStatsValue from "../AtStatsValue/AtStatsValue";
import { getIconComponent } from "../../utils";

const AtStats = (props, context) => {
  let inner = [];
  if ("default" in context.slots) {
    const elements = [];
    const slot = context.slots.default();
    for (const node of slot) {
      let tag = undefined;
      if (
        Object.prototype.toString.call(node) === "[object Object]" &&
        "tag" in node
      ) {
        tag = node.tag;
      }
      if (tag === "a" || tag === "router-link") {
        node.data = Object.assign({}, node.data, {
          class: [
            "font-medium",
            "text-" + uiConfig.primaryTextColor + "-600",
            "hover:text-" + uiConfig.primaryTextColor + "-500",
          ].concat("class" in node.data ? node.data.class : ""),
        });
        elements.push(node);
      }
    }
    if (elements.length) {
      inner = h(
        "div",
        { class: "w-full bg-gray-50 px-4 py-4 sm:px-5" },
        elements
      );
    }
  }
  return h(
    "div",
    Object.assign({}, context.attrs, {
      class: [
        "flex flex-wrap items-center bg-white overflow-hidden shadow rounded-lg w-full",
      ].concat(
        "class" in context.attrs ? context.attrs.class : "",
        "staticClass" in context.attrs ? context.attrs.staticClass : ""
      ),
    }),
    [
      h("div", { class: "w-full px-4 py-5 sm:p-5" }, [
        h("div", { class: "flex items-center" }, [
          props.icon
            ? h(
                "div",
                {
                  class:
                    "flex-shrink-0 text-white bg-" +
                    uiConfig.primaryBackgroundColor +
                    "-600 rounded-md",
                },
                [h(getIconComponent(props.icon).Icon, { class: "w-8 m-2" })]
              )
            : null,
          h("div", { class: ["w-0 flex-1", { "ml-5": props.icon }] }, [
            "title" in context.slots || props.title !== undefined
              ? h(AtStatsTitle, null, {
                  default: () =>
                    "title" in context.slots
                      ? context.slots.title()
                      : props.title,
                })
              : null,
            "value" in context.slots || props.value !== undefined
              ? h(
                  AtStatsValue,
                  {
                    class: {
                      "mt-1 text-3xl": !props.icon,
                      "text-2xl": props.icon,
                    },
                  },
                  {
                    default: () =>
                      "value" in context.slots
                        ? context.slots.value()
                        : props.value,
                  }
                )
              : null,
          ]),
        ]),
      ]),
      inner,
    ]
  );
};

AtStats.props = {
  title: { type: [String, Number], default: "" },
  value: { type: [String, Number], default: "" },
  icon: { type: [String, Object], default: () => "" },
};

export default AtStats;
