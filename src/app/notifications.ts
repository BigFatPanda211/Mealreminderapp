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
      hour: 7,
      minute: 0,
      title: isEisha ? 'Time for breakfast, Begum! ❤️' : 'Time for breakfast! 🌅',
      body: isEisha ? 'Start your day with something delicious 💕' : 'Start your day right!'
    },
    {
      hour: 12,
      minute: 0,
      title: isEisha ? "Don't forget lunch, Begum! ☀️" : "Don't forget lunch! ☀️",
      body: isEisha ? 'Wish we were together for lunch :)' : 'Keep your energy up!'
    },
    {
      hour: 18,
      minute: 0,
      title: isEisha ? 'Dinner time, Begum! 🌙' : 'Dinner time! 🌙',
      body: isEisha ? 'A great end to an amazing day ❤️' : 'End your day with a good meal!'
    }
  ];

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