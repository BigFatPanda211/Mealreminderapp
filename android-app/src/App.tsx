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
import MealCard from './components/MealCard';
import WaterCounter from './components/WaterCounter';

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

  useEffect(() => {
    loadUserData();
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
      console.error('Failed to load data:', error);
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
      console.error('Failed to save data:', error);
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Daily Nourish</Text>
        <Text style={styles.subtitle}>Stay healthy, stay happy</Text>

        <TextInput
          style={styles.countryInput}
          placeholder="Enter your country"
          placeholderTextColor="#b5b5c9"
          value={country}
          onChangeText={handleCountryChange}
        />
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
    marginBottom: 24,
    fontSize: 14
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
