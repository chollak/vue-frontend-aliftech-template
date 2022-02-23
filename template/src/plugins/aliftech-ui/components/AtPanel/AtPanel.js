import { h } from "vue";
import "./AtPanel.scss";

import { transformToBool } from "../../utils";

import AtPanelTitle from "../AtPanelTitle/AtPanelTitle";
import AtPanelSubTitle from "../AtPanelSubTitle/AtPanelSubTitle";

const AtPanel = (props, ctx) => {
  const headerElement =
    "header" in ctx.slots || props.title || props.subTitle
      ? h(
          "div",
          {
            class: [
              {
                "py-5 px-4 sm:px-6": !props?.noHeaderPadding,
                "border-b border-gray-200": transformToBool(props.borderHeader),
              },
            ],
          },
          "header" in ctx.slots
            ? ctx.slots.header({
                title: props.title,
                subTitle: props.subTitle,
              })
            : [
                props.title
                  ? h(AtPanelTitle, null, { default: () => props.title })
                  : null,
                props.subTitle
                  ? h(AtPanelSubTitle, null, { default: () => props.subTitle })
                  : null,
              ]
        )
      : undefined;

  return h(
    "div",
    {
      class: "bg-white shadow rounded-lg w-full",
      style: { marginBlockEnd: "auto" },
    },
    [
      headerElement,
      "default" in ctx.slots
        ? h(
            "div",
            {
              class: [
                "at-panel-wrapper px-4 sm:px-6 w-full",
                {
                  "overflow-x-auto": transformToBool(props.overflow),
                  "pt-5 sm:pt-6":
                    headerElement === undefined && "footer" in ctx.slots,
                  "py-5 sm:pb-6": !(
                    headerElement !== undefined && "footer" in ctx.slots
                  ),
                  "py-6": "footer" in ctx.slots && props.borderHeader,
                },
              ],
            },
            ctx.slots.default()
          )
        : null,
      "footer" in ctx.slots
        ? h(
            "div",
            {
              class: [
                "px-4 py-4 sm:px-6 bg-gray-50 rounded-b-lg",
                {
                  "border-t border-gray-200": transformToBool(
                    props.borderFooter
                  ),
                },
              ],
            },
            ctx.slots.footer()
          )
        : null,
    ]
  );
};

AtPanel.props = {
  title: { type: String, default: "" },
  subTitle: { type: String, default: "" },
  noHeaderPadding: { type: Boolean, default: false },
  borderHeader: { type: [Boolean, String, Number], default: true },
  borderFooter: { type: [Boolean, String, Number], default: true },
  overflow: { type: [Boolean, String, Number], default: true },
};

export default AtPanel;
