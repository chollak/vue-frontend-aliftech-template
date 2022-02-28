import { h, defineComponent } from 'vue';
import SidebarItemLink from './SidebarItemLink';
import { sidebarItemProps } from './sidebarMixins';

export const SidebarItem = defineComponent({
  name: 'AtSidebarItem',
  props: { ...sidebarItemProps.props },
  data() {
    return {
      isCollapseItem: false,
    };
  },
  methods: {
    toggleItemCollapse() {
      this.isCollapseItem = !this.isCollapseItem;
    },
  },
  render() {
    return h(SidebarItemLink, {
      item: this.item,
      collapsed: this.isCollapseItem,
      active: this.active,
      routeName: this?.$route?.name ?? '',
      onClick: () => this.toggleItemCollapse(),
    });
  },
});
