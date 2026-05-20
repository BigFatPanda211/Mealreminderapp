importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyBzhbfYE0N481ywfE_8Zw9z29R5lpicwKo",
  authDomain: "panda-s-meal-reminder-app.firebaseapp.com",
  projectId: "panda-s-meal-reminder-app",
  storageBucket: "panda-s-meal-reminder-app.firebasestorage.app",
  messagingSenderId: "296167729243",
  appId: "1:296167729243:web:707194054d7deb17ab377e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const { title, body } = payload.notification;
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    vibrate: [200, 100, 200],
  });
});