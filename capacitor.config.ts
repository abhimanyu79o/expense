import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.expensetracker.app',
  appName: 'Expense Tracker',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    // Configure any plugin specific options here
  }
};

export default config;