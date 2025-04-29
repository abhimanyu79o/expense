# Expense Tracker App

A simple expense tracker application that allows you to add, edit, and delete expenses. The app stores all data locally on your device and displays a summary of total expenses.

## Features

- Add, edit, and delete expenses
- View expenses sorted by date or amount
- Offline functionality with local storage
- Budget tracking against a limit of 10 lakh rupees (₹1,000,000)
- Responsive design for all device sizes
- PWA support for offline use
- Can be converted to Android APK

## Technologies Used

- React with TypeScript
- Tailwind CSS and shadcn/ui for styling
- LocalStorage for data persistence
- Capacitor for Android APK conversion

## Getting Started

### Prerequisites

- Node.js version 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Converting to APK

This application can be converted to an Android APK using Capacitor. 

### Prerequisites for APK conversion:

- Android Studio installed
- Android SDK configured
- JDK 11 or higher installed

### Steps to create an APK:

1. Build the application:
   ```
   npm run build
   ```

2. Run the Android initialization script:
   ```
   node init-android.js
   ```

3. Open the Android project in Android Studio:
   ```
   npx cap open android
   ```

4. In Android Studio, click "Build" > "Build Bundle(s) / APK(s)" > "Build APK(s)"

5. Find the APK file in `android/app/build/outputs/apk/debug/`

## Usage

1. Launch the application
2. Use the "Add New Expense" form to enter expense details:
   - Description (required)
   - Amount (required)
   - Date (defaults to today)
3. Click "Add Expense" to save the expense
4. View, edit, or delete expenses from the list
5. Monitor your spending against the 10 lakh budget limit

## Offline Support

The application works offline and stores all data locally on your device.

## License

MIT