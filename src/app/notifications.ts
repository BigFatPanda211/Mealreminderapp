export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const permission = await Notification.requestPermission();
  return permission === 'granted';
};

export const scheduleNotifications = (isEisha: boolean) => {
  if (Notification.permission !== 'granted') return;

  const now = new Date();

  const meals = [
    {
      hour: 9,
      minute: 0,
      title: isEisha ? 'Time for breakfast, Begum! ❤️' : 'Time for breakfast! 🌅',
      body: isEisha ? 'Start your day with something delicious 💕' : 'Start your day right!'
    },
    {
      hour: 13,
      minute: 30,
      title: isEisha ? "Don't forget lunch, Begum! ☀️" : "Don't forget lunch! ☀️",
      body: isEisha ? 'Wish we were together for lunch :)' : 'Keep your energy up!'
    },
    {
      hour: 19,
      minute: 15,
      title: isEisha ? 'Dinner time, Begum! 🌙' : 'Dinner time! 🌙',
      body: isEisha ? 'A great end to an amazing day ❤️' : 'End your day with a good meal!'
    }
  ];

  // Water reminders every hour from 7 AM to 8 PM
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

  for (let hour = 8; hour <= 19; hour++) {
    const scheduled = new Date();
    scheduled.setHours(hour, 0, 0, 0);

    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    const delay = scheduled.getTime() - now.getTime();
    const message = waterMessages[(hour - 8) % waterMessages.length];

    setTimeout(() => {
      new Notification('💧 Water Reminder', {
        body: message,
        icon: '/favicon.ico'
      });
    }, delay);
  }

  // Schedule meal notifications
  meals.forEach(({ hour, minute, title, body }) => {
    const scheduled = new Date();
    scheduled.setHours(hour, minute, 0, 0);

    if (scheduled <= now) {
      scheduled.setDate(scheduled.getDate() + 1);
    }

    const delay = scheduled.getTime() - now.getTime();

    setTimeout(() => {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }, delay);
  });
};