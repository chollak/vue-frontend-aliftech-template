import { uiConfig } from "../../install";

export const setInputBorderClass = (error, success) => {
  if (error) {
    return "border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500";
  } else if (success) {
    return "border-green-300 text-green-900 placeholder-green-300 focus:ring-green-500 focus:border-green-500";
  } else {
    return (
      "focus:ring-" +
      uiConfig.primaryBorderColor +
      "-500 focus:border-" +
      uiConfig.primaryBorderColor +
      "-500 border-gray-300"
    );
  }
};

export const getInputHelpType = (error, success) => {
  if (error) {
    return "error";
  } else if (success) {
    return "success";
  } else {
    return "muted";
  }
};
