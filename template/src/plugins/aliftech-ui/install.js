/* Connecting tailwind css styles */
import "./assets/scss/main.scss";
import "./assets/css/main.css";

export const uiConfig = (() => {
  let config = require("./defaults/aliftech.config.default.js");
  const files = require.context("~/../", false);
  files.keys().forEach((file) => {
    if (/aliftech.config.js/g.test(file)) {
      try {
        config = Object.assign(
          {},
          require("./defaults/aliftech.config.default.js"),
          files(file)
        );
      } catch (e) {
        config = require("./defaults/aliftech.config.default.js");
      }
    }
  });
  return config;
})();
