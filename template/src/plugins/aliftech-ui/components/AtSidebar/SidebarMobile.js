import { h, defineComponent } from "vue";
import { SidebarItem } from "./SidebarItem";
import { props, methods } from "./sidebarMixins";

export default defineComponent({
  name: "SidebarMobile",
  props: {
    ...props.props,
    isOpen: { type: Boolean, default: false },
    logout: { type: Function, default: () => {} },
  },
  data() {
    return {
      isHiddenSidebar: true,
      isOpenSidebar: false,
    };
  },
  watch: {
    isOpen() {
      if (this.isOpen) {
        this.isHiddenSidebar = !this.isOpen;
        setTimeout(() => {
          this.isOpenSidebar = this.isOpen;
        }, 50);
      } else {
        setTimeout(() => {
          this.isHiddenSidebar = !this.isOpen;
        }, 300);
        this.isOpenSidebar = this.isOpen;
      }
    },
  },
  created() {
    this.isOpenSidebar = this.isOpen;
  },
  methods: {
    ...methods.methods,
    closeSidebar() {
      this.$emit("closeSidebar");
    },
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

    const renderCloseButton = () => {
      return this.isOpenSidebar
        ? h(
            "button",
            {
              class: [
                "ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white",
              ],
              onClick: () => this.closeSidebar(),
            },
            [h("span", { class: ["sr-only"] }, "Close sidebar"), h("fe-x-icon")]
          )
        : null;
    };

    return h(
      "div",
      {
        class: ["fixed inset-0 flex z-40", { hidden: this.isHiddenSidebar }],
      },
      [
        h("div", {
          class: [
            "fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ease-linear duration-300",
            this.isOpenSidebar ? "opacity-100" : "opacity-0",
          ],
          "aria-hidden": "true",
          onClick: () => this.closeSidebar(),
        }),
        h(
          "div",
          {
            class: [
              "relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white transition ease-in-out duration-300 transform",
              this.isOpenSidebar ? "translate-x-0" : "-translate-x-full",
            ],
          },
          [
            h(
              "div",
              {
                class: [
                  "absolute top-0 right-0 -mr-12 pt-2 ease-in-out duration-300",
                  this.isOpenSidebar ? "opacity-100" : "opacity-0",
                ],
              },
              [renderCloseButton()]
            ),
            h("div", { class: ["flex-shrink-0 flex items-center px-4"] }, [
              "logo" in this.$slots
                ? this.$slots?.logo?.()
                : this.logo
                ? h("router-link", {
                    class: ["h-8 w-auto"],
                    to: "/",
                    tag: "img",
                    src: this.logo?.path,
                    alt: this.logo?.name,
                  })
                : h("router-link", {
                    class: ["h-8 w-auto"],
                    to: "/",
                    tag: "img",
                    src: "https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg",
                    alt: "Логотип",
                  }),
            ]),
            h("div", { class: ["flex-1 h-0 overflow-y-auto"] }, [
              h("nav", { class: ["mt-5 px-2 space-y-1"] }, [
                renderSidebarItems(),
              ]),
            ]),
          ]
        ),
      ]
    );
  },
});
