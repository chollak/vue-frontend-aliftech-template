import app from "../main";
import { createRouter, createWebHashHistory } from "vue-router";
import appRoutes from "./app";
import authRoutes from "./auth";
// import store from "~/store";
import { getToken } from "~/services/apiClient";
import { getUser } from "~/services/auth.api";

const routes = [
  ...appRoutes,
  ...authRoutes,
  {
    path: "/forbidden",
    name: "error403",
    component: () => import(`~/views/ForbiddenPage`),
    meta: { title: "Доступ запрещен", public: true, error: true },
  },
  {
    path: "/:pathMatch(.*)*",
    name: "error404",
    component: () => import(`~/views/NotFoundPage`),
    meta: { title: "Страница не найдена", public: true, error: true },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

const AUTH_COMPONENT_NAME = "Auth";

router.beforeEach(async (to) => {
  document.title = to?.meta?.title ? to.meta.title : "";
  const isPublic = to.meta.public;
  const hasToken = getToken() && getToken() !== "";

  if (!isPublic && !hasToken) {
    const prevUrl = to.fullPath;
    return {
      name: AUTH_COMPONENT_NAME,
      query: { ...(prevUrl !== "/" ? { from: prevUrl } : {}) },
    };
  }
  if (hasToken && to.name === AUTH_COMPONENT_NAME) {
    return { path: "/" };
  }
  if (hasToken && !isPublic) {
    const currentUser = app.config.globalProperties?.$_at_user;
    if (!currentUser) {
      const { data } = await getUser();
      app.config.globalProperties.$_at_user = data;
    }
  }

  // if (isPublic) {
  //   if (hasToken && to.name === AUTH_COMPONENT_NAME) {
  //     next({ path: "/" });
  //   } else {
  //     next();
  //   }
  // } else {
  //   if (hasToken) {
  //     console.log("Fetch user info ...");
  //     // await getUser();
  //     next();
  //   } else {
  //     const prevUrl = to.fullPath;
  //     if (to.name !== AUTH_COMPONENT_NAME) {
  //       next({
  //         name: AUTH_COMPONENT_NAME,
  //         query: { ...(prevUrl !== "/" ? { from: prevUrl } : {}) },
  //       });
  //     } else {
  //       next();
  //     }
  //   }
  // }
});

export default router;
