import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shoreseason.app',
  appName: 'Shore & Season',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#f2f1e9',
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      backgroundColor: '#d9ded2',
      showSpinner: false,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#f2f1e9',
    },
  },
};

export default config;
