import { h } from "vue";
import { transformToBool } from "../../utils";
import AtTableItem from "../AtTableItem/AtTableItem";

const AtTable = (props, context) => {
  return (Array.isArray(props.head) && props.head.length) ||
    (Array.isArray(props.elements) && props.elements.length)
    ? h(
        "div",
        Object.assign({}, context.attrs, {
          class: ["at-panel-no-padding sm:rounded-lg"].concat(
            "class" in context.attrs ? context.attrs.class : ""
          ),
        }),
        [
          h(
            "div",
            {
              class:
                "at-table-wrapper shadow border-b border-gray-200 sm:rounded-lg",
            },
            [
              "header" in context.slots
                ? h(
                    "div",
                    {
                      class: [
                        "px-4 py-5 sm:px-6 bg-white",
                        {
                          "border-b border-gray-200": transformToBool(
                            props.borderHeader
                          ),
                        },
                      ],
                    },
                    [context.slots.header()]
                  )
                : null,

              h("table", { class: "min-w-full divide-y divide-gray-200" }, [
                Array.isArray(props.head) && props.head.length
                  ? h("thead", [
                      h("tr", [
                        props.head.map((head, index) => {
                          const element =
                            Object.prototype.toString.call(head) ===
                              "[object Object]" &&
                            "context" in head &&
                            Object.prototype.toString.call(head.context) ===
                              "[object Object]"
                              ? head.context
                              : {};
                          if ("head" in context.slots) {
                            return context.slots.head({ head: head, index });
                          }
                          const withoutData = Object.assign({}, element);
                          if ("data" in withoutData) {
                            delete withoutData.data;
                          }
                          return h(
                            "th",
                            Object.assign({}, withoutData, {
                              class: [
                                "px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider",
                              ].concat(
                                "class" in withoutData ? withoutData.class : "",
                                "data" in element &&
                                  Object.prototype.toString.call(
                                    element.data
                                  ) === "[object Object]" &&
                                  "class" in element.data
                                  ? element.data.class
                                  : "",
                                "data" in element &&
                                  Object.prototype.toString.call(
                                    element.data
                                  ) === "[object Object]" &&
                                  "staticClass" in element.data
                                  ? element.data.staticClass
                                  : ""
                              ),
                            }),
                            Object.prototype.toString.call(head) ===
                              "[object Object]" && "title" in head
                              ? head.title
                              : null
                          );
                        }),
                      ]),
                    ])
                  : null,
                Array.isArray(props.elements) && props.elements.length
                  ? h("tbody", { class: "bg-white divide-y divide-gray-200" }, [
                      props.elements.map((element, index) => {
                        const withTr = transformToBool(props.withTr);
                        function node() {
                          function render(el) {
                            return h(
                              AtTableItem,
                              Object.assign(
                                {},
                                Object.prototype.toString.call(el) ===
                                  "[object Object]" && "context" in el
                                  ? el.context
                                  : {}
                              ),
                              Object.prototype.toString.call(el) ===
                                "[object Object]" && "value" in el
                                ? el.value
                                : el
                            );
                          }
                          if ("element" in context.slots) {
                            return context.slots.element({
                              element,
                              index,
                              cols: Array.isArray(props.head)
                                ? props.head.length
                                : 0,
                            });
                          }
                          if (Array.isArray(element)) {
                            return element.map(render);
                          }
                          return render(element);
                        }
                        if (withTr) {
                          return h(
                            "tr",
                            {
                              class: `${
                                props.type === "striped"
                                  ? index % 2 === 0
                                    ? "bg-white"
                                    : "bg-gray-50"
                                  : ""
                              } hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out`,
                            },
                            [node()]
                          );
                        }
                        return [node()];
                      }),
                    ])
                  : null,
              ]),

              "footer" in context.slots
                ? h(
                    "div",
                    {
                      class: [
                        "px-4 py-5 sm:px-6",
                        {
                          "border-t border-gray-200": transformToBool(
                            props.borderFooter
                          ),
                        },
                      ],
                    },
                    [context.slots.footer()]
                  )
                : null,
            ]
          ),
        ]
      )
    : null;
};

AtTable.props = {
  head: {
    type: Array,
    validator: (head) =>
      head.every(
        (head) =>
          Object.prototype.toString.call(head) === "[object Object]" &&
          "title" in head
      ),
  },
  elements: {
    type: Array,
    default: () => [],
  },
  borderHeader: { type: [Boolean, String, Number], default: true },
  borderFooter: { type: [Boolean, String, Number], default: true },
  withTr: { type: [Boolean, Number, String], default: true },
  type: { type: String, default: "normal" },
};

export default AtTable;
