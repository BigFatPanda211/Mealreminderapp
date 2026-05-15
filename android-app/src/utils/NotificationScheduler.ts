import RNAlarmNotification from 'react-native-alarm-notification';
import { Platform } from 'react-native';

class NotificationScheduler {
  static async scheduleNotification(
    mealId: string,
    title: string,
    message: string,
    hours: number,
    minutes: number
  ) {
    try {
      if (Platform.OS !== 'android') {
        console.warn('Notification scheduling only works on Android');
        return;
      }

      const alarmNotifData = {
        title: title,
        message: message,
        channel: 'meal_reminders',
        ticker: 'Daily Nourish Reminder',
        auto_cancel: true,
        color: '#ffd4a3'
      };

      const fireDate = this.getNextOccurrence(hours, minutes);

      await RNAlarmNotification.scheduleAlarm({
        ...alarmNotifData,
        fire_date: fireDate.getTime()
      });

      console.log(`Scheduled ${mealId} notification for ${hours}:${minutes}`);
    } catch (error) {
      console.error(`Failed to schedule notification: ${error}`);
      throw error;
    }
  }

  static getNextOccurrence(hours: number, minutes: number): Date {
    const now = new Date();
    const nextOccurrence = new Date();
    nextOccurrence.setHours(hours, minutes, 0, 0);

    if (nextOccurrence <= now) {
      nextOccurrence.setDate(nextOccurrence.getDate() + 1);
    }

    return nextOccurrence;
  }

  static async cancelNotification(mealId: string) {
    try {
      await RNAlarmNotification.deleteAlarm(mealId);
    } catch (error) {
      console.error(`Failed to cancel notification: ${error}`);
    }
  }
}

export default NotificationScheduler;
