module.exports = {
  name: 'fynspo',
  version: '1.0.0',
  expo: {
    scheme: "fynspo",
    extra: {
    clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
    eas: {
      projectId: "601bbef9-cc0a-41fc-b7a0-e263683950d4",
    },
    icon: "./assets/images/icon.png"
  },
  ios: {  
      bundleIdentifier: 'com.fynspo.app',
      buildNumber: '6'
    }
  },
  android: {
    package: 'com.fynspo.app',
    versionCode: 6,
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
    }
  }
   
};