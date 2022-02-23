import { hasOwnProperty } from "~/plugins/aliftech-ui/utils/hasOwnProperty";

export const validateItem = (item) =>
  !item.to
    ? hasOwnProperty(item, "routes") &&
      item.routes.length &&
      hasOwnProperty(item, "title") &&
      typeof item.title === "string"
    : hasOwnProperty(item, "to") &&
      typeof item.to === "object" &&
      hasOwnProperty(item, "title") &&
      typeof item.title === "string";
