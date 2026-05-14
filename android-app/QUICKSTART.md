# Daily Nourish Android App - Quick Start

## 3 Simple Steps to Run

### Step 1: Install Dependencies
```bash
cd android-app
npm install
```
Wait for it to complete (2-5 minutes).

### Step 2: Create `android/local.properties`
Create a file `android/local.properties` in the android-app folder with:

**Windows:**
```properties
sdk.dir=C:\Users\YOUR_USERNAME\AppData\Local\Android\sdk
```

**Mac:**
```properties
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
```

Replace `YOUR_USERNAME` with your actual Windows/Mac username.

### Step 3: Run the App
```bash
npm run android
```

This will:
- Start the development server
- Build the Android app
- Install it on your connected device or emulator
- Launch automatically

---

## What You Need

✅ Android device connected via USB (with USB Debugging enabled)  
**OR**  
✅ Android emulator running (from Android Studio)

## First Time Only

When the app starts, it will ask for notification permission. Tap **Allow**.

---

## Troubleshooting

**Port already in use?**
```bash
npm start -- --port 8081
```

**Build fails?**
```bash
cd android && ./gradlew clean
cd ..
npm install
npm run android
```

**Device not found?**
```bash
adb devices
```

If your phone doesn't show, restart it and enable USB Debugging in Settings.

---

Done! Your meal reminder app is now running on your Android device! 🎉
