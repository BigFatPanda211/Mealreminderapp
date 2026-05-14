import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';

interface MealCardProps {
  meal: string;
  emoji: string;
  color: string;
  time: string;
  isCompleted: boolean;
  mealDetail: string;
  country: string;
  onEaten: (description: string) => void;
}

const MEAL_RECOMMENDATIONS: Record<string, Record<string, string[]>> = {
  japan: {
    breakfast: ['Miso soup with rice', 'Tamagoyaki (rolled omelette)', 'Natto and rice'],
    lunch: ['Ramen', 'Sushi rolls', 'Katsudon'],
    dinner: ['Teriyaki salmon with rice', 'Shabu-shabu', 'Tempura set']
  },
  india: {
    breakfast: ['Idli with sambar', 'Paratha with curd', 'Poha'],
    lunch: ['Dal and rice', 'Vegetable curry with roti', 'Biryani'],
    dinner: ['Paneer tikka masala', 'Chole bhature', 'Dosa with chutney']
  },
  pakistan: {
    breakfast: ['Halwa puri', 'Paratha with chai', 'Nihari', 'Anda paratha'],
    lunch: ['Biryani', 'Karahi chicken', 'Pulao', 'Daal chawal'],
    dinner: ['Seekh kebabs', 'Haleem', 'Chicken tikka', 'Roti sabzi']
  },
  mexico: {
    breakfast: ['Chilaquiles', 'Huevos rancheros', 'Tamales'],
    lunch: ['Tacos al pastor', 'Enchiladas', 'Pozole'],
    dinner: ['Mole chicken', 'Chiles rellenos', 'Quesadillas']
  },
  italy: {
    breakfast: ['Cappuccino with cornetto', 'Frittata', 'Biscotti with coffee'],
    lunch: ['Pasta carbonara', 'Margherita pizza', 'Risotto'],
    dinner: ['Osso buco', 'Lasagna', 'Caprese salad with bread']
  },
  usa: {
    breakfast: ['Pancakes with maple syrup', 'Bacon and eggs', 'Oatmeal with fruit'],
    lunch: ['Burger and fries', 'Caesar salad', 'Grilled cheese sandwich'],
    dinner: ['Steak with potatoes', 'BBQ ribs', 'Mac and cheese']
  },
  france: {
    breakfast: ['Croissant with butter', 'Pain au chocolat', 'Tartine with jam'],
    lunch: ['Quiche Lorraine', 'Croque monsieur', 'French onion soup'],
    dinner: ['Coq au vin', 'Ratatouille', 'Beef bourguignon']
  },
  china: {
    breakfast: ['Congee', 'Steamed buns', 'Fried dough sticks (youtiao)'],
    lunch: ['Dumplings', 'Fried rice', 'Kung pao chicken'],
    dinner: ['Hot pot', 'Peking duck', 'Mapo tofu']
  },
  korea: {
    breakfast: ['Kimchi fried rice', 'Soup with rice', 'Egg roll (gyeran mari)'],
    lunch: ['Bibimbap', 'Bulgogi', 'Japchae'],
    dinner: ['Korean BBQ', 'Kimchi stew', 'Tteokbokki']
  },
  thailand: {
    breakfast: ['Rice soup (khao tom)', 'Thai omelette', 'Jok (rice porridge)'],
    lunch: ['Pad Thai', 'Green curry', 'Tom yum soup'],
    dinner: ['Massaman curry', 'Papaya salad with sticky rice', 'Basil chicken']
  },
  greece: {
    breakfast: ['Greek yogurt with honey', 'Spanakopita', 'Bougatsa'],
    lunch: ['Souvlaki', 'Greek salad', 'Moussaka'],
    dinner: ['Lamb chops', 'Pastitsio', 'Stuffed peppers']
  }
};

export default function MealCard({
  meal,
  emoji,
  color,
  time,
  isCompleted,
  mealDetail,
  country,
  onEaten
}: MealCardProps) {
  const [inputValue, setInputValue] = useState('');

  const getRecommendations = (): string[] => {
    if (!country) return [];
    const countryKey = country.toLowerCase().trim();
    const mealType = meal as 'breakfast' | 'lunch' | 'dinner';
    return MEAL_RECOMMENDATIONS[countryKey]?.[mealType] || [];
  };

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onEaten(inputValue.trim());
      setInputValue('');
    }
  };

  const recommendations = getRecommendations();

  return (
    <View style={[styles.container, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={styles.header}>
        <View style={[styles.emoji, { backgroundColor: color }]}>
          <Text style={styles.emojiText}>{emoji}</Text>
        </View>
        <View style={styles.mealInfo}>
          <Text style={styles.mealName}>{meal}</Text>
          <Text style={styles.mealTime}>{time}</Text>
        </View>
        {isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </View>

      {recommendations.length > 0 && !isCompleted && (
        <View style={styles.suggestionsSection}>
          <Text style={styles.suggestionsLabel}>Suggestions:</Text>
          <View style={styles.suggestionsContainer}>
            {recommendations.map((rec, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionChip}
                onPress={() => setInputValue(rec)}
              >
                <Text style={styles.suggestionText}>{rec}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {isCompleted ? (
        <View style={styles.completedSection}>
          <Text style={styles.completedText}>{mealDetail || 'Meal logged'}</Text>
        </View>
      ) : (
        <View style={styles.inputSection}>
          <TextInput
            style={styles.input}
            placeholder="What did you eat?"
            placeholderTextColor="#b5b5c9"
            value={inputValue}
            onChangeText={setInputValue}
          />
          <TouchableOpacity
            style={[styles.button, { opacity: inputValue.trim() ? 1 : 0.4 }]}
            onPress={handleSubmit}
            disabled={!inputValue.trim()}
          >
            <Text style={styles.buttonText}>Eaten</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  emoji: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  emojiText: {
    fontSize: 28
  },
  mealInfo: {
    flex: 1
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5a5a7a',
    marginBottom: 4,
    textTransform: 'capitalize'
  },
  mealTime: {
    fontSize: 13,
    color: '#b5b5c9'
  },
  checkmark: {
    fontSize: 20,
    color: '#a8d5ba',
    fontWeight: 'bold'
  },
  suggestionsSection: {
    marginBottom: 12
  },
  suggestionsLabel: {
    fontSize: 11,
    color: '#9a9ab5',
    marginBottom: 8,
    fontWeight: '600'
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  suggestionChip: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 212, 163, 0.1)',
    marginBottom: 4
  },
  suggestionText: {
    fontSize: 12,
    color: '#6a6a8a',
    fontWeight: '500'
  },
  completedSection: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 212, 163, 0.1)'
  },
  completedText: {
    color: '#5a5a7a',
    fontSize: 14
  },
  inputSection: {
    gap: 8
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: '#f8f8fb',
    color: '#5a5a7a',
    fontSize: 14
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 212, 163, 0.2)',
    alignItems: 'center'
  },
  buttonText: {
    color: '#5a5a7a',
    fontSize: 14,
    fontWeight: '600'
  }
});
