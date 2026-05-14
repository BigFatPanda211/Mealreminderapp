import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNAlarmNotification from 'react-native-alarm-notification';
import MealCard from './components/MealCard';
import WaterCounter from './components/WaterCounter';
import NotificationScheduler from './utils/NotificationScheduler';

export default function App() {
  const [waterCount, setWaterCount] = useState(0);
  const [completedMeals, setCompletedMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false
  });
  const [mealDetails, setMealDetails] = useState({
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  const [country, setCountry] = useState('Pakistan');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const mealTimes = {
    breakfast: { start: '07:00', end: '10:00' },
    lunch: { start: '12:00', end: '14:00' },
    dinner: { start: '18:00', end: '20:00' }
  };

  useEffect(() => {
    loadUserData();
    scheduleNotifications();
  }, []);

  const loadUserData = async () => {
    try {
      const saved = await AsyncStorage.getItem('mealReminderData');
      if (saved) {
        const data = JSON.parse(saved);
        setCompletedMeals(data.completedMeals || {});
        setMealDetails(data.mealDetails || {});
        setWaterCount(data.waterCount || 0);
        setCountry(data.country || 'Pakistan');
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const saveUserData = async () => {
    try {
      await AsyncStorage.setItem(
        'mealReminderData',
        JSON.stringify({
          completedMeals,
          mealDetails,
          waterCount,
          country
        })
      );
    } catch (error) {
      console.error('Failed to save user data:', error);
    }
  };

  const scheduleNotifications = async () => {
    if (!notificationsEnabled) return;

    const notificationTitles = {
      breakfast: 'Time for breakfast! 🌅',
      lunch: 'Lunch time! ☀️',
      dinner: 'Dinner time! 🌙'
    };

    for (const [meal, times] of Object.entries(mealTimes)) {
      const [hours, minutes] = times.start.split(':');
      
      try {
        await NotificationScheduler.scheduleNotification(
          meal,
          notificationTitles[meal],
          `Don't forget to log your ${meal}!`,
          parseInt(hours),
          parseInt(minutes)
        );
      } catch (error) {
        console.error(`Failed to schedule ${meal} notification:`, error);
      }
    }
  };

  const handleMealEaten = (meal: 'breakfast' | 'lunch' | 'dinner', description: string) => {
    if (!completedMeals[meal]) {
      const newCompletedMeals = { ...completedMeals, [meal]: true };
      const newMealDetails = { ...mealDetails, [meal]: description };
      
      setCompletedMeals(newCompletedMeals);
      setMealDetails(newMealDetails);

      const messages = {
        breakfast: [
          'Great start to your day!',
          'You\'re fueling your morning right!',
          'Breakfast champion!'
        ],
        lunch: [
          'Midday power-up complete!',
          'Keep that energy going!',
          'Fantastic lunch choice!'
        ],
        dinner: [
          'Perfect ending to your day!',
          'Well done on completing your meals!',
          'Sweet dreams start with good nutrition!'
        ]
      };

      const randomMessage = messages[meal][Math.floor(Math.random() * messages[meal].length)];
      Alert.alert('Success!', randomMessage);

      saveUserData();
    }
  };

  const incrementWater = () => {
    const newCount = waterCount + 1;
    setWaterCount(newCount);
    saveUserData();
  };

  const decrementWater = () => {
    const newCount = Math.max(0, waterCount - 1);
    setWaterCount(newCount);
    saveUserData();
  };

  const handleCountryChange = (text: string) => {
    setCountry(text);
    saveUserData();
  };

  const toggleNotifications = async () => {
    setNotificationsEnabled(!notificationsEnabled);
    if (!notificationsEnabled) {
      await scheduleNotifications();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Nourish</Text>
        <Text style={styles.subtitle}>Stay healthy, stay happy</Text>

        <TextInput
          style={styles.countryInput}
          placeholder="Enter your country (e.g., Japan, India)"
          placeholderTextColor="#b5b5c9"
          value={country}
          onChangeText={handleCountryChange}
        />

        <TouchableOpacity
          style={[
            styles.notificationToggle,
            { backgroundColor: notificationsEnabled ? '#ffd4a3' : '#e0e0e0' }
          ]}
          onPress={toggleNotifications}
        >
          <Text style={styles.notificationToggleText}>
            {notificationsEnabled ? '🔔 Notifications ON' : '🔕 Notifications OFF'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mealsContainer}>
        <MealCard
          meal="breakfast"
          emoji="🌅"
          color="#ffd4a3"
          time="7:00 AM - 10:00 AM"
          isCompleted={completedMeals.breakfast}
          mealDetail={mealDetails.breakfast}
          onEaten={(desc) => handleMealEaten('breakfast', desc)}
          country={country}
        />

        <MealCard
          meal="lunch"
          emoji="☀️"
          color="#b4e4ff"
          time="12:00 PM - 2:00 PM"
          isCompleted={completedMeals.lunch}
          mealDetail={mealDetails.lunch}
          onEaten={(desc) => handleMealEaten('lunch', desc)}
          country={country}
        />

        <MealCard
          meal="dinner"
          emoji="🌙"
          color="#d4b3ff"
          time="6:00 PM - 8:00 PM"
          isCompleted={completedMeals.dinner}
          mealDetail={mealDetails.dinner}
          onEaten={(desc) => handleMealEaten('dinner', desc)}
          country={country}
        />
      </View>

      <View style={styles.waterSection}>
        <WaterCounter count={waterCount} onIncrement={incrementWater} onDecrement={decrementWater} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fef3f3'
  },
  header: {
    paddingTop: 40,
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#5a5a7a',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#9a9ab5',
    marginBottom: 16
  },
  countryInput: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    color: '#5a5a7a',
    marginBottom: 16,
    fontSize: 14
  },
  notificationToggle: {
    width: '100%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center'
  },
  notificationToggleText: {
    color: '#5a5a7a',
    fontSize: 14,
    fontWeight: '600'
  },
  mealsContainer: {
    paddingHorizontal: 20,
    gap: 16
  },
  waterSection: {
    paddingHorizontal: 20,
    paddingBottom: 30
  }
});
