import { validateItem } from "./validations";
import { hasOwnProperty } from "~/plugins/aliftech-ui/utils/hasOwnProperty";

export const methods = {
  methods: {
    checkActiveRoute(item) {
      if (item?.routes && item?.routes?.length) {
        return (
          this.$route?.name &&
          item?.routes?.some((itemRoute) =>
            this.$route?.name?.match(`${itemRoute?.to?.name}*`)
          )
        );
      }
      return (
        this.$route?.name && this.$route?.name?.match(`${item?.to?.name}*`)
      );
    },
  },
};

export const props = {
  props: {
    items: {
      type: Array,
      default: () => [],
      validator: (arr) => {
        return arr.every((item) => validateItem(item));
      },
    },
    logo: {
      type: Object,
      default: () => {},
      validator: function (obj) {
        return hasOwnProperty(obj, "name") && hasOwnProperty(obj, "path");
      },
    },
    user: {
      type: Object,
      default: () => {},
      validator: (obj) => {
        return Object.keys(obj).length
          ? hasOwnProperty(obj, "name") && hasOwnProperty(obj, "phone")
          : {};
      },
    },
    noUserSection: { type: Boolean, default: false },
  },
};

export const sidebarItemProps = {
  props: {
    item: {
      type: Object,
      default: () => {},
      validator: function (obj) {
        return validateItem(obj);
      },
    },
    active: { type: Boolean, default: false },
  },
};
