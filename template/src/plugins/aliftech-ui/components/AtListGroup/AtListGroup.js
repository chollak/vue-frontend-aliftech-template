import { h } from "vue";

const AtListGroup = (props, context) => {
  return h(
    "div",
    Object.assign({}, context.attrs, {
      class: ["bg-white shadow overflow-hidden sm:rounded-md"].concat(
        "class" in context.attrs ? context.attrs.class : ""
      ),
    }),
    [h("ul", "default" in context.slots ? context.slots.default() : null)]
  );
};

export default AtListGroup;
