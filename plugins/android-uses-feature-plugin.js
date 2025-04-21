// plugins/android-uses-feature-plugin.js
const { withAndroidManifest } = require("@expo/config-plugins");

module.exports = function withCustomUsesFeature(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults;
    
    // Užtikriname, kad yra 'uses-feature' masyvas
    if (!manifest.manifest["uses-feature"]) {
      manifest.manifest["uses-feature"] = [];
    }

    // Pridedame feature
    manifest.manifest["uses-feature"].push({
      $: {
        "android:name": "android.hardware.telephony",
        "android:required": "false",
      },
    });

    return config;
  });
};
