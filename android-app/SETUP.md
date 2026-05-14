# Daily Nourish - Android App Setup

This is a React Native Android app with local device notification scheduling for meal reminders.

## Prerequisites

1. **Node.js & npm/yarn** - Install from https://nodejs.org/
2. **Android Studio** - Download from https://developer.android.com/studio
3. **Android SDK** - Install via Android Studio (API level 31+)
4. **Java Development Kit (JDK)** - Android Studio includes it

## Setup Instructions

### 1. Install Dependencies

```bash
cd android-app
npm install
# or
yarn install
```

### 2. Set Up Android Environment

Create a file `android/local.properties` with:

```properties
sdk.dir=/path/to/your/android/sdk
```

On Mac/Linux, the default path is usually:
```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

On Windows:
```
sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\sdk
```

### 3. Generate Android Project (if needed)

```bash
npx react-native init DailyNourish
```

Then replace the `src` folder with the one provided.

## Building & Running

### Development (with Metro bundler)

```bash
npm start
```

In another terminal:
```bash
npm run android
```

This will:
- Start the Metro bundler
- Build and install the app on a connected device or emulator
- Launch the app automatically

### Build Release APK

```bash
npm run build-android
```

Output: `android/app/build/outputs/apk/release/app-release.apk`

### Build App Bundle (for Google Play)

```bash
cd android && ./gradlew bundleRelease
```

Output: `android/app/build/outputs/bundle/release/app.aab`

## Features

✅ **Meal Reminders** - Set breakfast (7-10 AM), lunch (12-2 PM), dinner (6-8 PM)
✅ **Local Notifications** - Device-based alerts (no internet needed)
✅ **Meal Logging** - Track what you ate
✅ **Country Cuisine Suggestions** - 11 countries with meal recommendations
✅ **Water Intake Counter** - Log daily water consumption
✅ **Persistent Storage** - All data saved locally
✅ **Notification Control** - Toggle reminders on/off

## Meal Schedule

- **Breakfast**: 7:00 AM - 10:00 AM
- **Lunch**: 12:00 PM - 2:00 PM
- **Dinner**: 6:00 PM - 8:00 PM

## Supported Countries

1. Japan
2. India
3. Pakistan
4. Mexico
5. Italy
6. USA
7. France
8. China
9. Korea
10. Thailand
11. Greece

## Troubleshooting

### Metro bundler fails to start
```bash
npm start -- --reset-cache
```

### Gradle build fails
```bash
cd android && ./gradlew clean
cd ../
npm start
npm run android
```

### Emulator doesn't appear
```bash
adb devices
```

Then run:
```bash
npm run android
```

### Permissions not granted
The app will request notification permissions on first launch. Grant them to receive meal reminders.

## Notification Permissions

For Android 12+, the app requires `POST_NOTIFICATIONS` permission. Grant it when prompted.

## Publishing to Google Play

1. Generate a release keystore:
```bash
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

2. Update `android/app/build.gradle` with keystore details

3. Build release APK or App Bundle

4. Upload to Google Play Console

## Support

For issues with notifications or other features, check:
- Android version (API 31+)
- Notification permissions granted
- Battery optimization settings (may affect notification delivery)
