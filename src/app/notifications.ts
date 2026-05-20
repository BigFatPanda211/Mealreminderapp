export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const scheduleNotifications = async (isEisha: boolean) => {
  if (Notification.permission !== 'granted') return;

  // Register service worker
  if (!('serviceWorker' in navigator)) return;

  const registration = await navigator.serviceWorker.register('/sw.js');
  await navigator.serviceWorker.ready;

  const now = new Date();
  const notifications: { delay: number; title: string; body: string }[] = [];

  const meals = [
    {
      hour: 9, minute: 0,
      title: isEisha ? 'Time for breakfast, Begum! ❤️' : 'Time for breakfast! 🌅',
      body: isEisha ? 'Start your day with something delicious 💕' : 'Start your day right!'
    },
    {
      hour: 13, minute: 0,
      title: isEisha ? "Don't forget lunch, Begum! ☀️" : "Don't forget lunch! ☀️",
      body: isEisha ? 'Wish we were together for lunch :)' : 'Keep your energy up!'
    },
    {
      hour: 19, minute: 0,
      title: isEisha ? 'Dinner time, Begum! 🌙' : 'Dinner time! 🌙',
      body: isEisha ? 'A great end to an amazing day ❤️' : 'End your day with a good meal!'
    }
  ];

  const waterMessages = isEisha ? [
    'Time to drink some water, Begum! 💧',
    'Stay hydrated my love! 💕',
    'Have a glass of water, Begum! 💧',
    'Hydration check! Drink up, Begum ❤️',
  ] : [
    'Time to drink some water! 💧',
    'Stay hydrated! 💧',
    'Have a glass of water! 💧',
    'Hydration check! Drink up! 💧',
  ];

  // Water reminders every hour from 8 AM to 7 PM
  for (let hour = 9; hour <= 19; hour++) {
    const scheduled = new Date();
    scheduled.setHours(hour, 0, 0, 0);
    if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);

    notifications.push({
      delay: scheduled.getTime() - now.getTime(),
      title: '💧 Water Reminder',
      body: waterMessages[(hour - 8) % waterMessages.length]
    });
  }

  // Meal reminders
  meals.forEach(({ hour, minute, title, body }) => {
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);
    if (scheduled <= now) scheduled.setDate(scheduled.getDate() + 1);

    notifications.push({
      delay: scheduled.getTime() - now.getTime(),
      title,
      body
    });
  });

  // Send to service worker
  registration.active?.postMessage({
    type: 'SCHEDULE_NOTIFICATIONS',
    notifications
  });
};