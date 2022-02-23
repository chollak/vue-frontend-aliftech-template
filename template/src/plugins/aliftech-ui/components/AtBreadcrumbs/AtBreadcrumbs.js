import { h } from "vue";
import RouterLocation from "../../validations/RouterLocation";
import { uiConfig } from "../../index";
import { HomeIcon, ChevronRightIcon } from "@heroicons/vue/solid";
import { RouterLink } from "vue-router";

/**
 * Component body
 * @param {Object} props
 * @returns {VNode}
 * @constructor
 */
const AtBreadcrumbs = (props) => {
  return h("nav", { class: "flex" }, [
    h("ol", { class: "flex items-center space-x-4" }, [
      h("li", [
        h("div", [
          h(
            RouterLink,
            {
              to: "/",
              class: [
                "text-gray-400",
                "hover:text-" + uiConfig.primaryBackgroundColor + "-600",
              ],
            },
            {
              default: () =>
                h(HomeIcon, {
                  class: "flex-shrink-0 h-5 w-5",
                  "aria-hidden": true,
                }),
            }
          ),
        ]),
      ]),
      props.items.length
        ? props.items.map((item) => {
            return h("li", [
              h("div", { class: "flex items-center" }, [
                h(ChevronRightIcon, {
                  class: "flex-shrink-0 h-5 w-5 text-gray-400",
                  "aria-hidden": true,
                }),
                item.current
                  ? h(
                      "span",
                      {
                        class: [
                          "ml-4 text-sm font-medium text-gray-800 mt-0.5",
                        ],
                        "aria-current": "page",
                      },
                      item.title
                    )
                  : h(
                      RouterLink,
                      {
                        to: item.to,
                        class: [
                          "ml-4 text-sm font-medium text-gray-500 mt-0.5",
                          "hover:text-" +
                            uiConfig.primaryBackgroundColor +
                            "-700",
                        ],
                        "aria-current": undefined,
                      },
                      { default: () => item.title }
                    ),
              ]),
            ]);
          })
        : null,
    ]),
  ]);
};

// Component props
AtBreadcrumbs.props = {
  items: {
    type: Array,
    required: true,
    validator: (items) =>
      Array.isArray(items) &&
      items.every((item) => {
        if (Object.prototype.toString.call(item) !== "[object Object]")
          return false;
        if (!("title" in item)) return false;
        if (Object.prototype.toString.call(item.title) !== "[object String]")
          return false;
        if ("to" in item) return RouterLocation(item.to);
        return true;
      }),
  },
};

export default AtBreadcrumbs;
