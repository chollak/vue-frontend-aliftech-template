import { h, ref, Transition, defineComponent } from "vue";
import { hasOwnProperty } from "~/plugins/aliftech-ui/utils/hasOwnProperty";

import AtDropdownItem from "../../components/AtDropdownItem/AtDropdownItem";
import { MenuItems, MenuButton, Menu } from "@headlessui/vue";

export default defineComponent({
  name: "SidebarUserDropdown",
  emits: ["update:onLogout"],
  props: {
    user: {
      type: Object,
      default: () => {},
      validator: (obj) => {
        return Object.keys(obj).length
          ? hasOwnProperty(obj, "name") && hasOwnProperty(obj, "phone")
          : {};
      },
    },
    isMobileOrTablet: { type: Boolean, default: false },
  },
  setup() {
    let isOpen = ref(false);
    let showMenu = ref(false);

    return { isOpen, showMenu };
  },
  render() {
    const formatUserPhone = (phoneNumber) => {
      const countryCode = phoneNumber.slice(0, 3);
      const operatorCode = phoneNumber.slice(3, 5);
      const phone = `${phoneNumber.slice(5, 8)} ${phoneNumber.slice(
        8,
        10
      )} ${phoneNumber.slice(10, 12)}`;
      return `+${countryCode} ${operatorCode} ${phone}`;
    };

    const heroIcon = () =>
      h(
        "svg",
        {
          class: [
            "flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500",
          ],
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 20 20",
          "aria-hidden": "true",
          fill: "currentColor",
        },
        [
          h("path", {
            "fill-rule": "evenodd",
            d: "M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z",
            "clip-rule": "evenodd",
          }),
        ]
      );

    return !this.isMobileOrTablet
      ? h(
          Menu,
          {
            class: "px-3 mt-6 relative inline-block text-left w-full",
            as: "div",
          },
          {
            default: () => [
              h("div", [
                h(
                  MenuButton,
                  {
                    class:
                      "group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500",
                  },
                  {
                    default: () =>
                      h(
                        "span",
                        { class: ["flex w-full justify-between items-center"] },
                        [
                          h(
                            "span",
                            {
                              class: [
                                "flex min-w-0 items-center justify-between space-x-3",
                              ],
                            },
                            [
                              h("img", {
                                class: [
                                  "w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 object-cover",
                                ],
                                src:
                                  this.user?.avatar_link ??
                                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmPReGCHDr3lDMPI3fSycaaL0ecArfpvJtfQ&usqp=CAU",
                                alt: "User avatar",
                              }),
                              h(
                                "span",
                                { class: ["flex-1 min-w-0 text-left"] },
                                [
                                  h(
                                    "span",
                                    {
                                      class: [
                                        "text-gray-900 text-sm font-medium truncate block",
                                      ],
                                    },
                                    this.user?.name ?? "Неизвестный"
                                  ),
                                  h(
                                    "span",
                                    {
                                      class: ["text-gray-500 text-xs truncate"],
                                    },
                                    this.user?.phone
                                      ? formatUserPhone(this.user?.phone)
                                      : "–"
                                  ),
                                ]
                              ),
                            ]
                          ),
                          heroIcon(),
                        ]
                      ),
                  }
                ),
              ]),
              h(
                MenuItems,
                {
                  class:
                    "z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none",
                },
                {
                  default: () => [
                    "userDropdownItems" in this.$slots
                      ? this.$slots.userDropdownItems()
                      : null,
                    h(
                      AtDropdownItem,
                      {
                        icon: { name: "logout", type: "outline" },
                        onClick: () => {
                          this.$emit("update:onLogout");
                        },
                      },
                      { default: () => "Выйти" }
                    ),
                  ],
                }
              ),
            ],
          }
        )
      : h(
          Menu,
          { class: "px-3 mt-6 relative inline-block text-left", as: "div" },
          {
            default: () => {
              return [
                h(
                  MenuButton,
                  {
                    class:
                      "group w-full bg-gray-100 rounded-md px-3.5 py-2 text-sm text-left font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-purple-500",
                  },
                  {
                    default: () =>
                      h(
                        "span",
                        { class: ["flex w-full justify-between items-center"] },
                        [
                          h(
                            "span",
                            {
                              class: [
                                "flex min-w-0 items-center justify-between space-x-3",
                              ],
                            },
                            [
                              h("img", {
                                class: [
                                  "w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 object-cover",
                                ],
                                src:
                                  this.user?.avatar_link ??
                                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmPReGCHDr3lDMPI3fSycaaL0ecArfpvJtfQ&usqp=CAU",
                                alt: "User avatar",
                              }),
                            ]
                          ),
                        ]
                      ),
                  }
                ),
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
                    default: () =>
                      h(
                        MenuItems,
                        {
                          class:
                            "z-10 mx-3 origin-top absolute right-0 left-0 mt-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-200 focus:outline-none",
                        },
                        {
                          default: () =>
                            h("div", { class: "py-1" }, [
                              h(AtDropdownItem, null, {
                                default: () =>
                                  h(
                                    "span",
                                    { class: ["flex-1 min-w-0 text-left"] },
                                    [
                                      h(
                                        "span",
                                        {
                                          class: [
                                            "text-gray-900 text-sm font-medium truncate block",
                                          ],
                                        },
                                        this.user?.name ?? "Неизвестный"
                                      ),
                                      h(
                                        "span",
                                        {
                                          class: [
                                            "text-gray-500 text-xs truncate",
                                          ],
                                        },
                                        this.user?.phone
                                          ? formatUserPhone(this.user?.phone)
                                          : "–"
                                      ),
                                    ]
                                  ),
                              }),
                              "userDropdownItems" in this.$slots
                                ? this.$slots.userDropdownItems()
                                : null,
                              h(
                                AtDropdownItem,
                                {
                                  icon: { name: "logout", type: "outline" },
                                  onClick: () => {
                                    this.$emit("update:onLogout");
                                  },
                                },
                                { default: () => "Выйти" }
                              ),
                            ]),
                        }
                      ),
                  }
                ),
              ];
            },
          }
        );
  },
});
