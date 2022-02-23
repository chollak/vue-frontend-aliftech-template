import { h, defineAsyncComponent } from "vue";
import { XIcon } from "@heroicons/vue/outline";
import { methods } from "../AtToast/notifications";

const renderIcon = (type) => {
  let iconName = type.icon;
  let iconType = type?.iconType || "outline";
  let icon = defineAsyncComponent(() =>
    import(`@heroicons/vue/${iconType}/${iconName}Icon`)
  );
  return h(icon, { class: ["w-6 h-6", type.Iconcolor] });
};

const types = {
  success: {
    icon: "CheckCircle",
    Iconcolor: "text-green-400",
    textColor: "text-gray-900",
  },
  error: {
    icon: "ExclamationCircle",
    Iconcolor: "text-red-400",
    textColor: "text-gray-900",
  },
  info: {
    icon: "InformationCircle",
    Iconcolor: "text-blue-400",
    textColor: "text-gray-900",
  },
  warning: {
    icon: "Exclamation",
    Iconcolor: "text-yellow-300",
    textColor: "text-gray-900",
  },
};

const Toast = (props) => {
  const type = types[props.type];
  return h(
    "div",
    {
      class:
        "max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden",
    },
    [
      h("div", { class: "p-4" }, [
        h(
          "div",
          { class: ["flex", props.subTitle ? "items-start" : "items-center"] },
          [
            h("div", { class: "flex-shrink-0" }, [renderIcon(type)]),
            h("div", { class: ["ml-3 w-0 flex-1 pt-0.5", type.textColor] }, [
              h(
                "p",
                { class: "text-sm font-medium" },
                {
                  default: () => props.title,
                }
              ),
              h(
                "p",
                { class: "mt-1 text-sm opacity-90" },
                {
                  default: () => props.subTitle,
                }
              ),
            ]),
            h("div", { class: "ml-4 flex-shrink-0 flex" }, [
              h(
                "button",
                {
                  class:
                    "rounded-md inline-flex text-gray-300 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500",
                  onClick: () => methods.remove(props.id),
                },
                [
                  h(
                    "span",
                    { class: "sr-only" },
                    {
                      default: () => "Close",
                    }
                  ),
                  h(XIcon, { class: "h-5 w-5" }),
                ]
              ),
            ]),
          ]
        ),
      ]),
    ]
  );
};

Toast.props = {
  title: { type: String, default: "" },
  subTitle: { type: String, default: "" },
  id: { type: String, required: true },
  type: { type: String, default: "info" },
  duration: { type: Number, default: 0 },
};

export default Toast;
