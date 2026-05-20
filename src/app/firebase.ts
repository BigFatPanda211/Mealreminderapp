import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBzhbfYE0N481ywfE_8Zw9z29R5lpicwKo",
  authDomain: "panda-s-meal-reminder-app.firebaseapp.com",
  projectId: "panda-s-meal-reminder-app",
  storageBucket: "panda-s-meal-reminder-app.firebasestorage.app",
  messagingSenderId: "296167729243",
  appId: "1:296167729243:web:707194054d7deb17ab377e"
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

export const requestFCMToken = async () => {
  try {
    const token = await getToken(messaging, {
  vapidKey: 'BOOkYZgvP7jpsZ-ukACYDAeODdkfhX3ETXB5ash9dZPE1gp6OQnuqPGk74IKseCUe6xBBLKGPkAFOMuCn9_q3EE'
});
    return token;
  } catch (error) {
    console.error('FCM token error:', error);
    return null;
  }
};