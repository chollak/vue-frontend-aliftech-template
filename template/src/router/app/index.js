import AppLayout from "~/layouts/AppLayout.vue";
import HomePage from "~/views/Home.vue";

const AboutPage = () =>
  import(/* webpackChunkName: "about" */ "~/views/About.vue");
const CreditsPage = () =>
  import(/* webpackChunkName: "credits" */ "~/views/Credits.vue");

export default [
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "",
        name: "Home",
        component: HomePage,
        meta: { public: true },
      },
      {
        path: "about",
        name: "About",
        component: AboutPage,
      },
      {
        path: "credits",
        name: "Credits",
        component: CreditsPage,
      },
    ],
  },
];
