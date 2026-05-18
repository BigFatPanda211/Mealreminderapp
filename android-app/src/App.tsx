import { useState } from 'react';
import { MealCard } from './components/MealCard';
import { WaterCounter } from './components/WaterCounter';
import { Toaster, toast } from 'sonner';

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
  const [country, setCountry] = useState('');

  const handleMealEaten = (meal: 'breakfast' | 'lunch' | 'dinner', description: string) => {
    if (!completedMeals[meal]) {
      setCompletedMeals(prev => ({ ...prev, [meal]: true }));
      setMealDetails(prev => ({ ...prev, [meal]: description }));

      const messages = {
        breakfast: ['Great start to your day!', "You're fueling your morning right!", 'Breakfast champion!', 'What a wonderful way to begin!'],
        lunch: ['Midday power-up complete!', 'Keep that energy going!', 'Fantastic lunch choice!', "You're doing amazing!"],
        dinner: ['Perfect ending to your day!', 'Well done on completing your meals!', 'Sweet dreams start with good nutrition!', 'You nourished yourself well today!']
      };

      const randomMessage = messages[meal][Math.floor(Math.random() * messages[meal].length)];
      toast.success(randomMessage);
    }
  };

  const incrementWater = () => setWaterCount(prev => prev + 1);
  const decrementWater = () => setWaterCount(prev => Math.max(0, prev - 1));

  const handleReset = () => {
    setWaterCount(0);
    setCompletedMeals({ breakfast: false, lunch: false, dinner: false });
    setMealDetails({ breakfast: '', lunch: '', dinner: '' });
    setCountry('');
    toast.success('Day has been reset!');
  };

  const getRecommendations = (meal: 'breakfast' | 'lunch' | 'dinner'): string[] => {
    if (!country) return [];

    const recommendations: Record<string, Record<string, string[]>> = {
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
      },
      pakistan: {
        breakfast: ['Halwa puri', 'Paratha with chai', 'Nihari', 'Anda paratha'],
        lunch: ['Biryani', 'Karahi chicken', 'Pulao', 'Daal chawal'],
        dinner: ['Seekh kebabs', 'Haleem', 'Chicken tikka', 'Roti sabzi']
      }
    };

    const countryKey = country.toLowerCase().trim();
    const countryData = recommendations[countryKey];
    if (countryData) return countryData[meal];
    return [];
  };

  return (
    <div className="size-full bg-gradient-to-br from-[#fef3f3] to-[#f0f4ff] flex items-center justify-center p-6">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl text-[#5a5a7a]">Daily Nourish</h1>
          <p className="text-sm text-[#9a9ab5]">Stay healthy, stay happy</p>
          <div className="pt-2">
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country (e.g., Japan, India)"
              className="w-full py-2.5 px-4 rounded-2xl bg-white/80 backdrop-blur-sm text-[#5a5a7a] placeholder:text-[#b5b5c9] outline-none focus:ring-2 focus:ring-[#d4b3ff]/30 transition-all text-center text-sm shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <MealCard
            meal="breakfast"
            emoji="🌅"
            color="#ffd4a3"
            time="7:00 AM - 10:00 AM"
            isCompleted={completedMeals.breakfast}
            mealDetail={mealDetails.breakfast}
            recommendations={getRecommendations('breakfast')}
            onEaten={(description) => handleMealEaten('breakfast', description)}
          />
          <MealCard
            meal="lunch"
            emoji="☀️"
            color="#b4e4ff"
            time="12:00 PM - 2:00 PM"
            isCompleted={completedMeals.lunch}
            mealDetail={mealDetails.lunch}
            recommendations={getRecommendations('lunch')}
            onEaten={(description) => handleMealEaten('lunch', description)}
          />
          <MealCard
            meal="dinner"
            emoji="🌙"
            color="#d4b3ff"
            time="6:00 PM - 8:00 PM"
            isCompleted={completedMeals.dinner}
            mealDetail={mealDetails.dinner}
            recommendations={getRecommendations('dinner')}
            onEaten={(description) => handleMealEaten('dinner', description)}
          />
        </div>

        <WaterCounter
          count={waterCount}
          onIncrement={incrementWater}
          onDecrement={decrementWater}
        />

        <button
          onClick={handleReset}
          className="w-full py-3 rounded-2xl bg-[#ffb3b3] hover:bg-[#ff9999] text-white font-medium transition-all shadow-sm"
        >
          RESET DAY
        </button>
      </div>
    </div>
  );
}