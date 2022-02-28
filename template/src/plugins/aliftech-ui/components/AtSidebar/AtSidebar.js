import { h, defineComponent } from 'vue';
import SidebarDesktop from './SidebarDesktop.js';
import SidebarMobile from './SidebarMobile.js';
import './sidebar.scss';
import { props } from './sidebarMixins';
import { MenuIcon } from '@heroicons/vue/outline';

export default defineComponent({
  name: 'AtSidebar',
  emits: ['onLogout'],
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
      this.isMobileOrTablet = /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
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
    if ('logo' in this.$slots) slots['logo'] = () => this.$slots.logo();
    if ('userDropdownItems' in this.$slots) slots['userDropdownItems'] = () => this.$slots.userDropdownItems();

    const renderSidebarByUserDevice = () => {
      return this.isMobileOrTablet
        ? h(
            SidebarMobile,
            {
              items: this.items,
              logo: this.logo,
              user: this.user,
              userDropdownItems: this.userDropdownItems,
              noUserSection: this.noUserSection,
              loggedIn: this.loggedIn,
              isOpen: this.isOpen,
              'onUpdate:onLogout': () => {
                this.$emit('onLogout');
              },
              onCloseSidebar: () => this.closeSidebar(),
            },
            { ...slots }
          )
        : h(
            SidebarDesktop,
            {
              items: this.items,
              logo: this.logo,
              user: this.user,
              userDropdownItems: this.userDropdownItems,
              noUserSection: this.noUserSection,
              loggedIn: this.loggedIn,
              'onUpdate:onLogout': () => {
                this.$emit('onLogout');
              },
            },
            { ...slots }
          );
    };

    return h('div', { class: ['h-screen flex overflow-hidden z-50'] }, [
      renderSidebarByUserDevice(),
      h('div', { class: ['flex flex-col w-0 flex-1 overflow-hidden'] }, [
        this.isMobileOrTablet
          ? h(
              'div',
              {
                class: ['relative z-10 flex-shrink-0 flex h-12 bg-white border-b border-gray-200'],
              },
              [
                h(
                  'button',
                  {
                    class: [
                      'px-4 sm:px-6 py-6 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500',
                    ],
                    onClick: () => this.openSidebar(),
                  },
                  [h('span', { class: ['sr-only'] }, 'Open sidebar'), h(MenuIcon, { class: 'h-6 w-6 text-gray-600' })]
                ),
              ]
            )
          : null,
        h('div', { class: ['px-4 sm:px-6 py-6 overflow-auto h-screen'] }, [this.$slots.default?.()]),
      ]),
    ]);
  },
});
