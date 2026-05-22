importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyBzhbfYE0N481ywfE_8Zw9z29R5lpicwKo",
  authDomain: "panda-s-meal-reminder-app.firebaseapp.com",
  projectId: "panda-s-meal-reminder-app",
  storageBucket: "panda-s-meal-reminder-app.firebasestorage.app",
  messagingSenderId: "296167729243",
  appId: "1:296167729243:web:707194054d7deb17ab377e",
});

const messaging = firebase.messaging();

// Don't call showNotification here - FCM handles it automatically
// Only handle background message data if needed
messaging.onBackgroundMessage((payload) => {
  console.log("Background message received:", payload);
  // Let FCM handle the notification display automatically
  // Don't call self.registration.showNotification() here
});
