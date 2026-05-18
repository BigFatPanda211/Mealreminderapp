import { useState, useEffect } from 'react';
import { MealCard } from './components/MealCard';
import { WaterCounter } from './components/WaterCounter';
import { Toaster, toast } from 'sonner';

const isEisha = (name: string) => ['eisha', 'begum'].includes(name.toLowerCase().trim());

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
  const [name, setName] = useState('');

  const eisha = isEisha(name);

  useEffect(() => {
    const saved = localStorage.getItem('dailyNourish');
    if (saved) {
      const data = JSON.parse(saved);
      setWaterCount(data.waterCount || 0);
      setCompletedMeals(data.completedMeals || { breakfast: false, lunch: false, dinner: false });
      setMealDetails(data.mealDetails || { breakfast: '', lunch: '', dinner: '' });
      setCountry(data.country || '');
      setName(data.name || '');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dailyNourish', JSON.stringify({
      waterCount, completedMeals, mealDetails, country, name
    }));
  }, [waterCount, completedMeals, mealDetails, country, name]);

  const handleMealEaten = (meal: 'breakfast' | 'lunch' | 'dinner', description: string) => {
    if (!completedMeals[meal]) {
      setCompletedMeals(prev => ({ ...prev, [meal]: true }));
      setMealDetails(prev => ({ ...prev, [meal]: description }));

      let message = '';
      if (eisha) {
        if (meal === 'breakfast') message = 'Yayyyy, Begum had a nutritious breakfast ❤️';
        if (meal === 'lunch') message = 'Wish we were together for lunch :)';
        if (meal === 'dinner') message = 'A great end to an amazing day';
      } else {
        const messages = {
          breakfast: ['Great start to your day!', "You're fueling your morning right!", 'Breakfast champion!', 'What a wonderful way to begin!'],
          lunch: ['Midday power-up complete!', 'Keep that energy going!', 'Fantastic lunch choice!', "You're doing amazing!"],
          dinner: ['Perfect ending to your day!', 'Well done on completing your meals!', 'Sweet dreams start with good nutrition!', 'You nourished yourself well today!']
        };
        message = messages[meal][Math.floor(Math.random() * messages[meal].length)];
      }
      toast.success(message);
    }
  };

  const incrementWater = () => setWaterCount(prev => Math.min(10, prev + 1));
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

  const completedCount = Object.values(completedMeals).filter(Boolean).length;

  // Theme colors
  const theme = eisha ? {
    bg: 'from-[#FFE5E7] to-[#F9DCC0]',
    card: 'bg-[#FFF0F0]/80',
    accent: 'from-[#FFD3D6] to-[#FFB0B5]',
    progress: 'from-[#FFC6CA] to-[#FFB0B5]',
    progressBg: 'bg-[#FFE5E7]',
    text: 'text-[#c0717a]',
    subtext: 'text-[#e0a0a8]',
    input: 'bg-[#FFF0F0]/80',
    reset: 'bg-[#FFB0B5] hover:bg-[#FF9BA1]',
    completedBg: 'bg-[#FFB0B5]',
  } : {
    bg: 'from-[#fef3f3] to-[#f0f4ff]',
    card: 'bg-white/80',
    accent: 'from-[#ffd4a3]/20 to-[#d4b3ff]/20',
    progress: 'from-[#ffd4a3] to-[#d4b3ff]',
    progressBg: 'bg-[#f0f0f8]',
    text: 'text-[#5a5a7a]',
    subtext: 'text-[#9a9ab5]',
    input: 'bg-white/80',
    reset: 'bg-[#ffb3b3] hover:bg-[#ff9999]',
    completedBg: 'bg-[#a8d5ba]',
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bg} flex flex-col items-center p-6 transition-all duration-700`}>
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <h1 className={`text-3xl ${theme.text}`}>
            {eisha ? '💕 Daily Nourish' : 'Daily Nourish'}
          </h1>
          <p className={`text-sm ${theme.subtext}`}>
            {eisha ? 'Made with love, just for you ❤️' : 'Stay healthy, stay happy'}
          </p>

          <div className="pt-2 space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full py-2.5 px-4 rounded-2xl ${theme.input} backdrop-blur-sm ${theme.text} placeholder:text-[#b5b5c9] outline-none focus:ring-2 focus:ring-[#FFC6CA]/30 transition-all text-center text-sm shadow-sm`}
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country (e.g., Japan, India)"
              className={`w-full py-2.5 px-4 rounded-2xl ${theme.input} backdrop-blur-sm ${theme.text} placeholder:text-[#b5b5c9] outline-none focus:ring-2 focus:ring-[#FFC6CA]/30 transition-all text-center text-sm shadow-sm`}
            />
          </div>
        </div>

        <div className="space-y-4">
          <MealCard meal="breakfast" emoji="🌅" color={eisha ? '#F9DCC0' : '#ffd4a3'} time="7:00 AM - 10:00 AM" isCompleted={completedMeals.breakfast} mealDetail={mealDetails.breakfast} recommendations={getRecommendations('breakfast')} onEaten={(description) => handleMealEaten('breakfast', description)} />
          <MealCard meal="lunch" emoji="☀️" color={eisha ? '#FFC6CA' : '#b4e4ff'} time="12:00 PM - 2:00 PM" isCompleted={completedMeals.lunch} mealDetail={mealDetails.lunch} recommendations={getRecommendations('lunch')} onEaten={(description) => handleMealEaten('lunch', description)} />
          <MealCard meal="dinner" emoji="🌙" color={eisha ? '#FFB0B5' : '#d4b3ff'} time="6:00 PM - 8:00 PM" isCompleted={completedMeals.dinner} mealDetail={mealDetails.dinner} recommendations={getRecommendations('dinner')} onEaten={(description) => handleMealEaten('dinner', description)} />
        </div>

        <div className={`w-full ${theme.card} backdrop-blur-sm rounded-3xl p-5 shadow-sm`}>
          <p className={`text-sm ${theme.subtext} mb-3 text-center`}>Daily Progress</p>
          <div className="flex justify-between mb-2">
            {['breakfast', 'lunch', 'dinner'].map((meal) => (
              <div key={meal} className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${completedMeals[meal as keyof typeof completedMeals] ? `${theme.completedBg} text-white` : `${theme.progressBg} text-[#b5b5c9]`}`}>
                  {completedMeals[meal as keyof typeof completedMeals] ? '✓' : '○'}
                </div>
                <p className={`text-xs ${theme.subtext} capitalize`}>{meal}</p>
              </div>
            ))}
          </div>
          <div className={`w-full ${theme.progressBg} rounded-full h-2 mt-3`}>
            <div
              className={`bg-gradient-to-r ${theme.progress} h-2 rounded-full transition-all duration-500`}
              style={{ width: `${(completedCount / 3) * 100}%` }}
            />
          </div>
          <p className={`text-xs text-center ${theme.subtext} mt-2`}>{completedCount}/3 meals completed</p>
        </div>

        <WaterCounter count={waterCount} onIncrement={incrementWater} onDecrement={decrementWater} />

        <button onClick={handleReset} className={`w-full py-3 rounded-2xl ${theme.reset} text-white font-medium transition-all shadow-sm`}>
          RESET DAY
        </button>
      </div>
    </div>
  );
}