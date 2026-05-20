import { useState, useEffect } from 'react';
import { MealCard } from './components/MealCard';
import { WaterCounter } from './components/WaterCounter';
import { Toaster, toast } from 'sonner';
import { requestNotificationPermission, scheduleNotifications } from './notifications';
import { logMeal, logWater, updateStreak } from './supabase';
import { requestFCMToken } from './firebase';

const isEisha = (name: string) => ['eisha', 'begum'].includes(name.toLowerCase().trim());
const isParents = (name: string) => ['abu', 'ammi'].includes(name.toLowerCase().trim());
const isSiblings = (name: string) => ['ashi', 'mano'].includes(name.toLowerCase().trim());
const isPanda = (name: string) => ['asad', 'kuchupuchu'].includes(name.toLowerCase().trim());

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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [streak, setStreak] = useState(0);

  const eisha = isEisha(name);
  const parents = isParents(name);
  const siblings = isSiblings(name);
  const panda = isPanda(name); 

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

  useEffect(() => {
    requestNotificationPermission().then((granted) => {
      if (granted) scheduleNotifications(eisha);
    });
  }, [eisha]);

  useEffect(() => {
  if (name) {
    requestFCMToken().then(token => {
      if (token) console.log('FCM Token:', token);
    });
  }
}, [name]);

  const handleMealEaten = (meal: 'breakfast' | 'lunch' | 'dinner', description: string) => {
    if (!completedMeals[meal]) {
      setCompletedMeals(prev => ({ ...prev, [meal]: true }));
      setMealDetails(prev => ({ ...prev, [meal]: description }));
      logMeal(name, meal, description);
      updateStreak(name).then(s => setStreak(s));

      let message = '';
      if (eisha) {
        if (meal === 'breakfast') message = 'Yayyyy, Begum had a nutritious breakfast ❤️';
        if (meal === 'lunch') message = 'Wish we were together for lunch :)';
        if (meal === 'dinner') message = 'Since youre done with dinner,can I have you for dessert?';
      } else if (parents) {
        if (meal === 'breakfast') message = 'ابو امّی، ناشتے کا وقت ہو گیا ہے۔';
        if (meal === 'lunch') message = 'یار، لنچ میں کیا کھانا ہے؟';
        if (meal === 'dinner') message = 'امّی، کھانے میں کیا بنا ہے';
      } else if (siblings) {
        if (meal === 'breakfast') message = 'Bonga no 01 and Bonga no 02, nashta kar lia karo -_-';
        if (meal === 'lunch') message = 'Have some lunch, you two namoonas';
        if (meal === 'dinner') message = 'Get some dinner for yourselves :)';
      } else if (panda) {
        if (meal === 'breakfast') message = 'Eat more fiber and protien';
        if (meal === 'lunch') message = 'Eat something very light, like fruit';
        if (meal === 'dinner') message = 'Skipping meals wont be a bad thing for once';
      }
       else {
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

  const incrementWater = () => {
  const newCount = Math.min(12, waterCount + 1);
  setWaterCount(newCount);
  if (name) logWater(name, newCount);
};

const decrementWater = () => {
  const newCount = Math.max(0, waterCount - 1);
  setWaterCount(newCount);
  if (name) logWater(name, newCount);
};

const setWaterCountDirect = (count: number) => {
  setWaterCount(count);
  if (name) logWater(name, count);
};

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

  const theme = eisha ? {
    bg: 'from-[#FFE5E7] to-[#F9DCC0]',
    card: 'bg-[#FFF0F0]/80',
    progress: 'from-[#FFC6CA] to-[#FFB0B5]',
    progressBg: 'bg-[#FFE5E7]',
    text: 'text-[#c0717a]',
    subtext: 'text-[#e0a0a8]',
    input: 'bg-[#FFF0F0]/80',
    reset: 'bg-[#FFB0B5] hover:bg-[#FF9BA1]',
    completedBg: 'bg-[#FFB0B5]',
    title: '💕 Daily Nourish',
    subtitle: 'Made with love, just for you ❤️',
    breakfastColor: '#F9DCC0',
    lunchColor: '#FFC6CA',
    dinnerColor: '#FFB0B5',
  } : parents ? {
    bg: 'from-[#F0E2C3] to-[#DCECE9]',
    card: 'bg-[#F2EAE0]/80',
    progress: 'from-[#F6C7B3] to-[#82B2C0]',
    progressBg: 'bg-[#C3DEDD]',
    text: 'text-[#82B2C0]',
    subtext: 'text-[#a0c4c8]',
    input: 'bg-[#F2EAE0]/80',
    reset: 'bg-[#F6C7B3] hover:bg-[#f0b09a]',
    completedBg: 'bg-[#82B2C0]',
    title: '💑 Daily Nourish',
    subtitle: 'صحت مند رہیں، خوش رہیں',
    breakfastColor: '#F0E2C3',
    lunchColor: '#F6C7B3',
    dinnerColor: '#C3DEDD',
  } : siblings ? {
    bg: 'from-[#F9C7D4] to-[#F0EEE2]',
    card: 'bg-[#F7E0E4]/80',
    progress: 'from-[#C3D0A8] to-[#859E91]',
    progressBg: 'bg-[#F0EEE2]',
    text: 'text-[#859E91]',
    subtext: 'text-[#99AC73]',
    input: 'bg-[#F7E0E4]/80',
    reset: 'bg-[#859E91] hover:bg-[#6e8a7a]',
    completedBg: 'bg-[#99AC73]',
    title: '🌿 Daily Nourish',
    subtitle: 'Eat up, you two!',
    breakfastColor: '#F9C7D4',
    lunchColor: '#C3D0A8',
    dinnerColor: '#859E91',
  }
  : panda ? {
    bg: 'from-[#F8EDEB] to-[#FAE1DD]',
    card: 'bg-[#FFF0F0]/80',
    progress: 'from-[#DDE5B6] to-[#ADC178]',
    progressBg: 'bg-[#DAD7CD]',
    text: 'text-[#C0717A]',
    subtext: 'text-[#E0A0A8]',
    input: 'bg-[#FFF0F0]/80',
    reset: 'bg-[#CED1F8] hover:bg-[#A7ABDE]',
    completedBg: 'bg-[#76C893]',
    title: '😎 Daily Nourish',
    subtitle: 'Go on a friggin diet fam 😑',
    breakfastColor: '#F7E1D7',
    lunchColor: '#DEDBD2',
    dinnerColor: '#B0C4B1',
  }
  : {
    bg: 'from-[#fef3f3] to-[#f0f4ff]',
    card: 'bg-white/80',
    progress: 'from-[#ffd4a3] to-[#d4b3ff]',
    progressBg: 'bg-[#f0f0f8]',
    text: 'text-[#5a5a7a]',
    subtext: 'text-[#9a9ab5]',
    input: 'bg-white/80',
    reset: 'bg-[#ffb3b3] hover:bg-[#ff9999]',
    completedBg: 'bg-[#a8d5ba]',
    title: 'Daily Nourish',
    subtitle: 'Stay healthy, stay happy',
    breakfastColor: '#ffd4a3',
    lunchColor: '#b4e4ff',
    dinnerColor: '#d4b3ff',
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br ${theme.bg} flex flex-col items-center justify-start p-6 transition-all duration-700`}>
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md space-y-8 py-8">
        <div className="text-center space-y-3">
          {streak > 0 && (
  <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-full ${theme.card} border border-white/60 shadow-md text-sm font-semibold ${theme.text}`}>
    🔥 {streak} day streak!
  </div>
)}
          <h1 className={`text-3xl ${theme.text}`}>{theme.title}</h1>
          <p className={`text-sm ${theme.subtext}`}>{theme.subtitle}</p>
          <div className="pt-2 space-y-2">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className={`w-full py-2.5 px-4 rounded-2xl ${theme.input} backdrop-blur-sm ${theme.text} placeholder:text-[#b5b5c9] outline-none focus:ring-2 transition-all text-center text-sm shadow-sm`}
            />
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country (e.g., Pakistan, Japan)"
              className={`w-full py-2.5 px-4 rounded-2xl ${theme.input} backdrop-blur-sm ${theme.text} placeholder:text-[#b5b5c9] outline-none focus:ring-2 transition-all text-center text-sm shadow-sm`}
            />
          </div>
        </div>

        <div className="space-y-4">
          <MealCard meal="breakfast" emoji="🌅" color={theme.breakfastColor} time="7:00 AM - 11:00 AM" isCompleted={completedMeals.breakfast} mealDetail={mealDetails.breakfast} recommendations={getRecommendations('breakfast')} onEaten={(description) => handleMealEaten('breakfast', description)} />
          <MealCard meal="lunch" emoji="☀️" color={theme.lunchColor} time="12:00 PM - 3:00 PM" isCompleted={completedMeals.lunch} mealDetail={mealDetails.lunch} recommendations={getRecommendations('lunch')} onEaten={(description) => handleMealEaten('lunch', description)} />
          <MealCard meal="dinner" emoji="🌙" color={theme.dinnerColor} time="6:00 PM - 9:00 PM" isCompleted={completedMeals.dinner} mealDetail={mealDetails.dinner} recommendations={getRecommendations('dinner')} onEaten={(description) => handleMealEaten('dinner', description)} />
        </div>

        <div className={`w-full ${theme.card} backdrop-blur-sm rounded-3xl p-5 shadow-md border border-white/60`}>
  <p className={`text-sm font-medium ${theme.text} mb-4 text-center`}>Daily Progress</p>
  <div className="relative flex justify-between items-center mb-4">
    <div className={`absolute top-6 left-[10%] right-[10%] h-0.5 ${theme.progressBg}`} />
    <div
      className={`absolute top-6 left-[10%] h-0.5 bg-gradient-to-r ${theme.progress} transition-all duration-700`}
      style={{ width: `${completedCount === 0 ? 0 : completedCount === 1 ? 40 : completedCount === 2 ? 80 : 80}%` }}
    />
    {['breakfast', 'lunch', 'dinner'].map((meal) => (
      <div key={meal} className="flex flex-col items-center gap-2 z-10">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-medium transition-all duration-300 shadow-sm ${completedMeals[meal as keyof typeof completedMeals] ? `${theme.completedBg} text-white scale-110` : `bg-white ${theme.subtext} border-2 border-[#ebebf5]`}`}>
          {completedMeals[meal as keyof typeof completedMeals] ? '✓' : meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'}
        </div>
        <p className={`text-xs font-medium ${completedMeals[meal as keyof typeof completedMeals] ? theme.text : theme.subtext} capitalize`}>{meal}</p>
      </div>
    ))}
  </div>
  <p className={`text-xs text-center ${theme.subtext} mt-1`}>{completedCount}/3 meals completed</p>
</div>

        <WaterCounter count={waterCount} onIncrement={incrementWater} onDecrement={decrementWater} onSetCount={setWaterCountDirect} />

       <button
  onClick={() => setShowResetConfirm(true)}
  className={`w-full py-3 rounded-2xl ${theme.reset} text-white font-medium transition-all shadow-sm`}
>
  RESET DAY
</button>
     </div>

      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className={`w-full max-w-sm rounded-3xl p-6 shadow-xl ${theme.card} space-y-4`}>
            <h2 className={`text-xl font-medium text-center ${theme.text}`}>Reset the day?</h2>
            <p className={`text-sm text-center ${theme.subtext}`}>This will clear all your meals and water intake for today.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className={`flex-1 py-3 rounded-2xl ${theme.progressBg} ${theme.subtext} font-medium transition-all`}
              >
                Cancel
              </button>
              <button
                onClick={() => { handleReset(); setShowResetConfirm(false); }}
                className={`flex-1 py-3 rounded-2xl ${theme.reset} text-white font-medium transition-all`}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
