// expo.config.js
import { withAndroidManifest } from "@expo/config-plugins";

const withCleartextTraffic = (config) => {
  return withAndroidManifest(config, (config) => {
    const application = config.modResults.manifest.application[0];
    application.$["android:usesCleartextTraffic"] = "true";
    return config;
  });
};

export default {
  ...require("./app.json").expo,
  plugins: [
    ...(require("./app.json").expo.plugins || []),
    withCleartextTraffic,
  ],
};
