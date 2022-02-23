import { defineComponent, h, toRefs } from "vue";
import RouterLocation from "../../validations/RouterLocation";

import { getIconComponent } from "../../utils";
import { uiConfig } from "~/plugins/aliftech-ui";

export default defineComponent({
  name: "AtTabs",
  emits: ["update:modelValue"],
  props: {
    modelValue: { type: [String, Number], default: "" },
    items: {
      type: Array,
      required: true,
      validator: (items) => {
        if (!Array.isArray(items)) return false;
        return items.every((item) => {
          if (
            Object.prototype.toString.call(item) === "[object Object]" &&
            "tag" in item
          ) {
            if (item.tag === "router-link") {
              if (!("to" in item)) {
                return false;
              } else {
                if (!RouterLocation(item.to)) return false;
              }
            }
          }
          return (
            Object.prototype.toString.call(item) === "[object Object]" &&
            "title" in item &&
            "value" in item
          );
        });
      },
    },
  },
  setup(props, { emit }) {
    let tab = toRefs(props).modelValue;

    const renderIcon = (icon, currentTab) => {
      const { Icon } = getIconComponent(icon);
      return h(Icon, {
        class: [
          "--ml-0.5 mr-2 h-5 w-5",
          currentTab
            ? "text-" + uiConfig.primaryTextColor + "-500"
            : "text-gray-400 group-hover:text-gray-500",
        ],
        "aria-hidden": true,
      });
    };
    return () =>
      h("div", [
        h("div", { class: "sm:hidden" }, [
          h(
            "select",
            {
              class:
                "w-full focus:ring-" +
                uiConfig.primaryBorderColor +
                "-500 focus:border-" +
                uiConfig.primaryBorderColor +
                "-500 border-gray-300 rounded-md",
              onChange: (e) => {
                emit("update:modelValue", e.target.value);
              },
            },
            [
              props.items.map((item) =>
                h(
                  "option",
                  { selected: tab.value === item.value, value: item.value },
                  item.title
                )
              ),
            ]
          ),
        ]),
        h("div", { class: "sm:block overflow-x-auto" }, [
          h("div", { class: "border-b border-gray-200" }, [
            h("nav", { class: "-mb-px flex space-x-8", "aria-label": "Tabs" }, [
              props.items.map((item) =>
                h(
                  "a",
                  {
                    class: [
                      "group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm cursor-pointer",
                      tab.value === item.value
                        ? "border-" +
                          uiConfig.primaryBorderColor +
                          "-500 text-" +
                          uiConfig.primaryTextColor +
                          "-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                    ],
                    onClick: (e) => {
                      e.preventDefault();
                      if (tab.value !== item?.value) {
                        emit("update:modelValue", item.value);
                      }
                    },
                  },
                  [
                    item?.icon
                      ? renderIcon(item.icon, tab.value === item.value)
                      : null,
                    h("span", [item.title]),
                  ]
                )
              ),
            ]),
          ]),
        ]),
      ]);
  },
});
