import { h, defineComponent } from "vue";
import SidebarDesktop from "./SidebarDesktop.js";
import SidebarMobile from "./SidebarMobile.js";
import "./sidebar.scss";
import { props } from "./sidebarMixins";
import SidebarUserDropdown from "./SidebarUserDropdown";

export default defineComponent({
  name: "AtSidebar",
  emits: ["onLogout"],
  props: { ...props.props, loggedIn: { type: Boolean, default: false } },
  data() {
    return {
      isOpen: false,
      isMobileOrTablet: false,
    };
  },
  watch: {
    $route() {
      this.isOpen = false;
    },
  },
  created() {
    const userAgent = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
      this.isMobileOrTablet = true;
    } else
      this.isMobileOrTablet =
        /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
          userAgent
        );
  },
  methods: {
    closeSidebar() {
      this.isOpen = false;
    },
    openSidebar() {
      this.isOpen = true;
    },
  },
  render() {
    const slots = {};
    if ("logo" in this.$slots) slots["logo"] = () => this.$slots.logo();
    if ("userDropdownItem" in this.$slots)
      slots["userDropdownItem"] = () => this.$slots.userDropdownItem();

    const renderSidebarByUserDevice = () => {
      return this.isMobileOrTablet
        ? h(
            SidebarMobile,
            {
              items: this.items,
              logo: this.logo,
              user: this.user,
              noUserSection: this.noUserSection,
              loggedIn: this.loggedIn,
              isOpen: this.isOpen,
              logout: () => this.logout(),
              closeSidebar: () => this.closeSidebar(),
            },
            { ...slots }
          )
        : h(
            SidebarDesktop,
            {
              items: this.items,
              logo: this.logo,
              user: this.user,
              noUserSection: this.noUserSection,
              loggedIn: this.loggedIn,
              "onUpdate:onLogout": () => {
                this.$emit("onLogout");
              },
            },
            { ...slots }
          );
    };

    return h("div", { class: ["h-screen flex overflow-hidden z-50"] }, [
      renderSidebarByUserDevice(),
      h("div", { class: ["flex flex-col w-0 flex-1 overflow-hidden"] }, [
        this.isMobileOrTablet
          ? h(
              "div",
              {
                class: [
                  "relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200",
                ],
              },
              [
                h(
                  "button",
                  {
                    class: [
                      "px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500",
                    ],
                    onClick: () => this.openSidebar(),
                  },
                  [
                    h("span", { class: ["sr-only"] }, "Open sidebar"),
                    h("fe-list-icon"),
                  ]
                ),
                this.noUserSection
                  ? null
                  : h(
                      "div",
                      { class: "flex items-center justify-end w-full pr-4" },
                      [
                        h(
                          SidebarUserDropdown,
                          {
                            user: this.user,
                            isMobileOrTablet: this.isMobileOrTablet,
                            "onUpdate:onLogout": () => {
                              this.$emit("onLogout");
                            },
                          },
                          {
                            userDropdownItems: () =>
                              "userDropdownItem" in this.$slots
                                ? this.$slots.userDropdownItem?.()
                                : null,
                          }
                        ),
                      ]
                    ),
              ]
            )
          : null,
        h("div", { class: ["p-6 overflow-auto h-screen"] }, [
          this.$slots.default?.(),
        ]),
      ]),
    ]);
  },
});
