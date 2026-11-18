const path = require('path');

const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Essais dans un navigateur (`npm run web:test`) : deux modules natifs n'existent pas sur le web
// et sont remplacés par des versions d'essai. Sans la variable ALBS_WEB_TEST, rien ne change —
// en particulier pour les builds iOS et Android.
if (process.env.ALBS_WEB_TEST) {
  const WEB_STUBS = {
    'react-native-maps': path.resolve(__dirname, 'tests/web/react-native-maps.tsx'),
    'expo-secure-store': path.resolve(__dirname, 'tests/web/expo-secure-store.ts'),
  };
  const defaultResolve = config.resolver.resolveRequest;
  config.resolver.resolveRequest = (context, moduleName, platform) => {
    if (platform === 'web' && WEB_STUBS[moduleName]) {
      return { type: 'sourceFile', filePath: WEB_STUBS[moduleName] };
    }
    return (defaultResolve ?? context.resolveRequest)(context, moduleName, platform);
  };
}

module.exports = withNativeWind(config, { input: './src/global.css' });
