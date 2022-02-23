import { uiConfig } from "../../../";

const primaryButtonClasses = (isLoading, isDisabled) => {
  switch (uiConfig.primaryBackgroundColor) {
    case "indigo":
      return isLoading || isDisabled
        ? "bg-indigo-400"
        : "bg-indigo-600 hover:bg-indigo-500 focus:bg-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700";
    case "blue":
      return isLoading || isDisabled
        ? "bg-blue-400"
        : "bg-blue-600 hover:bg-blue-500 focus:bg-blue-700 focus:shadow-outline-blue active:bg-blue-700";
    case "red":
      return isLoading || isDisabled
        ? "bg-red-400"
        : "bg-red-600 hover:bg-red-500 focus:bg-red-700 focus:shadow-outline-red active:bg-red-700";
    case "yellow":
      return isLoading || isDisabled
        ? "bg-yellow-400"
        : "bg-yellow-600 hover:bg-yellow-500 focus:bg-yellow-700 focus:shadow-outline-yellow active:bg-yellow-700";
    case "green":
      return isLoading || isDisabled
        ? "bg-green-400"
        : "bg-green-600 hover:bg-green-500 focus:bg-green-700 focus:shadow-outline-green active:bg-green-700";
    default:
      return isLoading || isDisabled
        ? "bg-indigo-400"
        : "bg-indigo-600 hover:bg-indigo-500 focus:bg-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700";
  }
};

export const getColor = (color, loading = false, disabled = false) => {
  switch (color) {
    case "primary":
      return `border-transparent text-white ${primaryButtonClasses(
        loading,
        disabled
      )}`;
    case "secondary":
      return `border-transparent  ${
        loading || disabled
          ? "text-" +
            uiConfig.primaryTextColor +
            "-400 bg-" +
            uiConfig.primaryBackgroundColor +
            "-50"
          : "text-" +
            uiConfig.primaryTextColor +
            "-700 bg-" +
            uiConfig.primaryBackgroundColor +
            "-100 hover:bg-" +
            uiConfig.primaryBackgroundColor +
            "-50 focus:border-" +
            uiConfig.primaryBorderColor +
            "-300 focus:shadow-outline-" +
            uiConfig.primaryBoxShadowColor +
            " active:bg-" +
            uiConfig.primaryBackgroundColor +
            "-200"
      }`;
    case "danger":
      return `border-transparent text-white ${
        loading || disabled
          ? "bg-red-400"
          : "bg-red-500 hover:bg-red-400 focus:border-red-600 focus:shadow-outline-red active:bg-red-600"
      }`;
    case "success":
      return `border-transparent text-white ${
        loading || disabled
          ? "bg-green-400"
          : "bg-green-500 hover:bg-green-400 focus:border-green-600 focus:shadow-outline-green active:bg-green-600"
      }`;
    case "warning":
      return `border-transparent ${
        loading || disabled
          ? "text-gray-500 bg-yellow-200"
          : "text-black bg-yellow-300 hover:bg-yellow-200 focus:border-yellow-400 focus:shadow-outline-yellow active:bg-yellow-400"
      }`;
    case "white":
      return `border-gray-300 ${
        loading || disabled
          ? "text-gray-400 bg-gray-50"
          : "text-gray-700 bg-white hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
      }`;
    default:
      return `border-gray-300 text-gray-700 ${
        loading || disabled
          ? "text-gray-400 bg-gray-50"
          : "text-gray-700 bg-white hover:text-gray-500 focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50"
      }`;
  }
};
