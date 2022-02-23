const AuthPage = () =>
  import(/* webpackChunkName: "auth" */ "~/views/Auth.vue");

export default [
  {
    path: "/auth",
    component: () => import("~/layouts/AuthLayout.vue"),
    meta: { public: true },
    children: [
      {
        path: "",
        name: "Auth",
        component: AuthPage,
      },
    ],
  },
];
