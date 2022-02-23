import axios from "axios";
import app from "../main";
import router from "../router";
import { checkType } from "../plugins/aliftech-ui/utils/checkType";
import { hasOwnProperty } from "../plugins/aliftech-ui/utils/hasOwnProperty";
import { deepCopy } from "../plugins/aliftech-ui/utils/deepCopy";
import { callbackIterableArray } from "../plugins/aliftech-ui/utils/callbackIterableArray";
import { callbackIterableObject } from "../plugins/aliftech-ui/utils/callbackIterableObject";
import { COOKIE_AUTH_TOKEN } from "../constants";

const BASE_URL = process.env.VUE_APP_BACKEND;
const SERVICE_TOKEN = process.env.VUE_APP_SERVICE_TOKEN;
const AUTH_COMPONENT_NAME = "Auth";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "Service-Token": SERVICE_TOKEN,
  },
});

/**
 *
 * @param {Object} config
 * @returns {Object}
 */
const requestInterceptor = (config) => {
  // Do something before request is sent
  return config;
};
/**
 *
 * @param {Object} response
 * @returns {Object}
 */
const responseInterceptor = (response) => {
  // Do something with response data
  return response;
};
/**
 * Actions for handling errors by status code
 */
const errorStatus = {
  400: function () {
    console.log("400 error from API, handle in apiClient.js");
  },
  401: function () {
    console.log("401 error from API, handle in apiClient.js");
    clearCookie().finally(() => {
      if (router.currentRoute.value.name !== AUTH_COMPONENT_NAME) {
        router.push({ name: AUTH_COMPONENT_NAME });
      }
    });
  },
  403: function () {
    console.log("403 error from API, handle in apiClient.js");
    router.replace({ name: "error403" });
  },
  404: function () {
    console.log("404 error from API, handle in apiClient.js");
    // router.push({ name: "not-found" });
  },
  /**
   * Indicates that previously valid authentication has expired.
   * Though not a part of the HTTP standard, the 419 status code is used as an alternative to 401
   * to differentiate from unauthorized clients being denied access.
   */
  419: function () {
    console.log("419 error from API, handle in apiClient.js");
    router.back() || router.push("/");
  },
  500: function () {
    console.log("500 error from API, handle in apiClient.js");
    // router.push({ name: "server-error" });
  },
};

export const generateError = function (error) {
  // if (error.response?.data && '$parsed' in error.response.data) return Promise.reject(error.response.data);
  if (
    hasOwnProperty(error?.response?.data, "errors") &&
    checkType(error?.response?.data?.errors, "object")
  ) {
    const result = {};
    const errors = deepCopy(error.response.data.errors);
    for (const key in errors) {
      result[key] = errors[key].join("<br />");
    }
    return Promise.reject(result);
  } else if (
    hasOwnProperty(error?.response?.data, "error") &&
    checkType(error?.response?.data?.error, "object") &&
    hasOwnProperty(error?.response?.data?.error, "message")
  ) {
    const result = error.response.data.error.message;
    return Promise.reject(result);
  } else if (
    hasOwnProperty(error?.response?.data, "lang") &&
    checkType(error?.response?.data?.lang, "object")
  ) {
    const locale = app.config.globalProperties.$i18n?.global?.locale;
    const result = error.response.data.lang[locale];
    return Promise.reject(result);
  } else if (
    hasOwnProperty(error?.response?.data, "message") &&
    checkType(error?.response?.data?.message, "string") &&
    error?.response?.data?.message !== ""
  ) {
    const result = error.response.data.message;
    return Promise.reject(result);
  }
  return Promise.reject(
    error.response?.data?.$parsed?.join(", ") ??
      "Network connection error, please try again later"
  );
};

const errorInterceptor = (e) => {
  if (e.response.status in errorStatus) {
    errorStatus[e.response.status](e);
  }
  const $parsed = ((error) => {
    const e = error?.response?.data ?? "Неизвестная ошибка";
    const parser = (e) => {
      let result = [];
      const callback = (object) => {
        if (checkType(object, "string")) result.push(object);
        if (checkType(object, "array")) callbackIterableArray(object, callback);
        if (checkType(object, "object"))
          callbackIterableObject(object, callback);
      };
      if (checkType(e, "array")) callbackIterableArray(e, callback);
      if (checkType(e, "object")) callbackIterableObject(e, callback);
      result = checkType(e, "string") ? [e] : result;
      return result.filter((e) => e.trim() !== "");
    };
    return checkType(e, "object") && "errors" in e
      ? parser(e.errors)
      : parser(e);
  })(e);
  const $generatedReject = generateError({
    ...e,
    response: {
      ...e.response,
      data: { ...e.response.data, $parsed },
    },
  });
  return $generatedReject;
};

const clearCookie = () =>
  app.config.globalProperties?.$cookie
    ? new Promise((resolve, reject) => {
        setToken("");
        const $cookie = app.config.globalProperties?.$cookie;
        try {
          $cookie.delete(COOKIE_AUTH_TOKEN);
          resolve();
        } catch (e) {
          reject(e);
        }
      })
    : (() => {
        const error =
          "[FE]Ошибка, не можем получить доступ к `cookie` на вашем устройстве";
        return Promise.reject(error);
      })();

/**
 * @return {String}
 * */
const getToken = function () {
  return apiClient?.defaults?.headers?.common?.["Authorization"] ?? "";
};

/**
 * @param {String} token
 * @return {VoidFunction}
 * */
const setToken = function (token) {
  if (apiClient?.defaults?.headers?.common)
    apiClient.defaults.headers.common["Authorization"] = token;
  else throw new Error("Ошибка во время установки токена");
};

apiClient.interceptors.request.use(requestInterceptor, errorInterceptor);
apiClient.interceptors.response.use(responseInterceptor, errorInterceptor);

export { apiClient, clearCookie, getToken, setToken };
