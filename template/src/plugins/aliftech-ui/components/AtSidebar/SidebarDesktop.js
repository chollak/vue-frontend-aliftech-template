import { h, defineComponent } from "vue";
import { SidebarItem } from "./SidebarItem";
import SidebarUserDropdown from "./SidebarUserDropdown";
import { props, methods } from "./sidebarMixins";
import { RouterLink } from "vue-router";

export default defineComponent({
  name: "AtSidebarDesktop",
  emits: ["update:onLogout"],
  props: {
    logout: { type: Function, default: () => {} },
    ...props.props,
  },
  methods: {
    ...methods.methods,
  },
  render() {
    const renderSidebarItems = () => {
      return this.items.map((item) =>
        h("div", [
          h(SidebarItem, {
            item,
            active: !!this?.checkActiveRoute(item),
          }),
        ])
      );
    };

    return h("div", { class: ["flex flex-shrink-0"] }, [
      h(
        "div",
        {
          class: [
            "flex flex-col w-64 border-r border-gray-200 pt-5 pb-4 bg-white",
          ],
        },
        [
          h("div", { class: ["flex items-center flex-shrink-0 px-5"] }, [
            "logo" in this.$slots
              ? this.$slots.logo()
              : this.logo
              ? h(
                  RouterLink,
                  { to: "/" },
                  {
                    default: () =>
                      h("img", {
                        class: ["h-8 w-auto"],
                        src: this?.logo?.path,
                        alt: this?.logo?.name,
                      }),
                  }
                )
              : h(
                  RouterLink,
                  { to: "/" },
                  {
                    default: () =>
                      h("img", {
                        class: ["h-8 w-auto"],
                        src: "https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg",
                        alt: "Логотип",
                      }),
                  }
                ),
          ]),
          h("div", { class: ["h-0 flex-1 flex flex-col overflow-y-auto"] }, [
            h("div", { class: ["flex-1 h-0 overflow-y-auto"] }, [
              this.noUserSection
                ? null
                : h(
                    SidebarUserDropdown,
                    {
                      user: this.user,
                      "onUpdate:onLogout": () => {
                        this.$emit("update:onLogout");
                      },
                    },
                    {
                      userDropdownItems: () => {
                        return "userDropdownItems" in this.$slots
                          ? this.$slots?.userDropdownItems?.()
                          : null;
                      },
                    }
                  ),
              h("nav", { class: ["mt-5 flex-1 px-2 bg-white space-y-1"] }, [
                renderSidebarItems(),
              ]),
            ]),
          ]),
        ]
      ),
    ]);
  },
});
