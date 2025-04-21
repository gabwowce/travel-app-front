const { withAndroidManifest } = require('@expo/config-plugins');

const withResizableActivity = (config) => {
  return withAndroidManifest(config, async (config) => {
    const mainApp = config.modResults.manifest.application[0];
    mainApp.$['android:resizeableActivity'] = 'true';
    return config;
  });
};

module.exports = withResizableActivity;
