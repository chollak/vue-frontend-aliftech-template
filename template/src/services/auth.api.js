import app from "../main";
import router from "~/router";
import { checkType } from "~/plugins/aliftech-ui/utils";
import { apiClient, clearCookie, setToken } from "~/services/apiClient";
import { COOKIE_AUTH_TOKEN } from "../constants";

const END_POINT = "/auth";
const AUTH_COMPONENT_NAME = "Auth";
const DEFAULT_EXPIRES_IN = 1;
const DEFAULT_REMEMBER_ME = "1D";

const setAuth = (res, rememberMe) => {
  const data = res?.data;
  const accessToken = data?.access_token;
  const tokenType = data?.token_type;
  const expiresIn = data?.expires_in ?? DEFAULT_EXPIRES_IN;
  const token = tokenType + " " + accessToken;

  if (checkType(accessToken, "string") && checkType(tokenType, "string")) {
    const $cookie = app.config.globalProperties?.$cookie;
    if ($cookie) {
      clearCookie().finally(() => {
        $cookie.set(COOKIE_AUTH_TOKEN, token, {
          expires: rememberMe ? `${expiresIn}m` : DEFAULT_REMEMBER_ME,
        });
      });
      setToken(token);
    }
  }
  return res;
};

/**
 *
 * @returns Object
 */
const getUser = () => apiClient.get(`${END_POINT}/user`);

/**
 * @param {Object} params - Request params
 * @returns {Promise<*>}
 *
 */
const login = (params) =>
  apiClient
    .post(`${END_POINT}/login-password`, {
      remember_me: true,
      ...params,
    })
    .then((response) => {
      setAuth(response, params.remember_me);
      return response;
    });

const logout = () =>
  apiClient.post(`${END_POINT}/logout`).then(() => {
    clearCookie().finally(() => {
      delete apiClient.defaults.headers.common["Authorization"];
      delete app.config.globalProperties.$_at_user;
      router.push({ name: AUTH_COMPONENT_NAME });
    });
  });

export { getUser, login, logout };
