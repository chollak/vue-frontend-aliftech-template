import { h, Transition } from "vue";

import { Menu, MenuButton, MenuItems } from "@headlessui/vue";
import { ChevronDownIcon } from "@heroicons/vue/solid";
import { getColor } from "../AtButton/methods/getColor";
import { transformToBool, getIconComponent } from "../../utils";
import { getSize } from "../AtButton/methods/getSize";
import AtLoading from "../AtLoading/AtLoading";

const AtDropdown = (props, { slots, attrs, emit }) => {
  return h(
    Menu,
    { ref: "at-dropdown", as: "div", class: "relative inline-block text-left" },
    {
      default: () => [
        h("div", [
          h(
            MenuButton,
            {
              class: [
                { "pointer-events-none": props.loading },
                getColor(
                  props.color,
                  props.loading,
                  transformToBool(attrs.disabled)
                ),
                getSize(props.size, props.iconButton),
                "inline-flex items-center border font-medium rounded-md focus:outline-none transition ease-in-out duration-150",
                { "rounded-full": props.iconButton },
              ],
            },
            {
              default: () => [
                props.loading
                  ? h(AtLoading, {
                      color: props.color,
                      size: props.size,
                    })
                  : null,
                props.icon
                  ? h(
                      "span",
                      {
                        class: [
                          "inline-block align-middle",
                          props.iconButton
                            ? {}
                            : {
                                "mr-1":
                                  props.size === "xs" || props.size === "sm",
                                "mr-2":
                                  props.size !== "xs" && props.size !== "sm",
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
                props.iconButton ? null : props.title,
                props.iconButton
                  ? null
                  : h(ChevronDownIcon, {
                      class: "-mr-1 ml-2 h-5 w-5",
                      "aria-hidden": true,
                    }),
              ],
            }
          ),
        ]),
        h(
          Transition,
          {
            enterActiveClass: "transition ease-out duration-100",
            enterFromClass: "transform opacity-0 scale-95",
            enterToClass: "transform opacity-100 scale-100",
            leaveActiveClass: "transition ease-in duration-75",
            leaveFromClass: "transform opacity-100 scale-100",
            leaveToClass: "transform opacity-0 scale-95",
          },
          {
            default: () => [
              h(
                MenuItems,
                {
                  onScroll: (e) => {
                    if (
                      e.target.scrollTop ===
                      e.target.scrollHeight - e.target.offsetHeight
                    ) {
                      emit("onScrolledToBottom");
                    }
                  },
                  class:
                    "origin-top-right absolute max-h-48 overflow-y-auto z-50 " +
                    props.position +
                    "-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none",
                },
                {
                  default: () => [
                    h(
                      "div",
                      {
                        class: [
                          "py-1",
                          { "divide-y divide-gray-100": props.withDividers },
                        ],
                      },
                      [
                        "header" in slots
                          ? h(
                              "div",
                              { class: "block px-4 py-2" },
                              slots.header?.()
                            )
                          : null,
                        slots.default?.(),
                      ]
                    ),
                  ],
                }
              ),
            ],
          }
        ),
      ],
    }
  );
};

AtDropdown.props = {
  title: { type: String, default: "Выберите значение" },
  color: { type: String, default: "white" },
  size: { type: String, default: "md" },
  loading: { type: Boolean, default: false },
  withDividers: { type: Boolean, default: false },
  position: {
    type: String,
    default: "left",
    validator: (value) => value === "left" || value === "right",
  },
  icon: { type: [String, Object], default: () => "" },
  iconButton: { type: Boolean, default: false },
};

export default AtDropdown;
