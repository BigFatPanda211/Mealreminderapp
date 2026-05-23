import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qejtabvmllifqhukltnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlanRhYnZtbGxpZnFodWtsdG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTUwNDMsImV4cCI6MjA5NDc5MTA0M30.yM5cKgO8Kprpp1JhuIIAt5Ns2xbjTuFzbPmOQ1faAFM';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const saveFCMToken = async (userName: string, token: string) => {
  await supabase.from('fcm_tokens').upsert({
    user_name: userName.toLowerCase().trim(),
    token
  }, { onConflict: 'user_name' });
};

export const logMeal = async (userName: string, mealType: string, foodEaten: string) => {
  await supabase.from('meal_logs').insert({
    user_name: userName,
    meal_type: mealType,
    food_eaten: foodEaten,
    date: new Date().toISOString().split('T')[0]
  });
};

export const editMeal = async (userName: string, mealType: string, foodEaten: string) => {
  const today = new Date().toISOString().split('T')[0];
  await supabase
    .from('meal_logs')
    .update({ food_eaten: foodEaten })
    .eq('user_name', userName)
    .eq('meal_type', mealType)
    .eq('date', today);
};

export const logWater = async (userName: string, glasses: number) => {
  await supabase.from('water_logs').upsert({
    user_name: userName,
    glasses,
    date: new Date().toISOString().split('T')[0]
  }, { onConflict: 'user_name,date' });
};
export const updateStreak = async (userName: string) => {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const { data } = await supabase
    .from('streaks')
    .select('*')
    .eq('user_name', userName)
    .single();

  if (!data) {
    // First time user
    await supabase.from('streaks').insert({
      user_name: userName,
      current_streak: 1,
      longest_streak: 1,
      last_logged_date: today
    });
    return 1;
  }

  if (data.last_logged_date === today) {
    return data.current_streak; // Already logged today
  }

  const newStreak = data.last_logged_date === yesterday
    ? data.current_streak + 1
    : 1; // Streak broken

  const longestStreak = Math.max(newStreak, data.longest_streak);

  await supabase.from('streaks').update({
    current_streak: newStreak,
    longest_streak: longestStreak,
    last_logged_date: today
  }).eq('user_name', userName);

  return newStreak;
};