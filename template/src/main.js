import { createApp } from "vue";
import VueCookie from "vue-cookie";
import AlifUI from "~/plugins/aliftech-ui";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { setToken } from "~/services/apiClient";
import { COOKIE_AUTH_TOKEN } from "~/constants";

const token = VueCookie.get(COOKIE_AUTH_TOKEN);
if (token) {
  try {
    setToken(token);
  } catch (e) {
    setToken("");
  }
}

const app = createApp(App);

app.use(store);
app.use(router);
app.use(AlifUI);

app.config.globalProperties.$cookie = VueCookie;
app.config.globalProperties.$_at_user = {};

app.mount("#app");

export default app;
