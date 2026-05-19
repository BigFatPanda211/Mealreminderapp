import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://qejtabvmllifqhukltnh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlanRhYnZtbGxpZnFodWtsdG5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMTUwNDMsImV4cCI6MjA5NDc5MTA0M30.yM5cKgO8Kprpp1JhuIIAt5Ns2xbjTuFzbPmOQ1faAFM';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const logMeal = async (userName: string, mealType: string, foodEaten: string) => {
  await supabase.from('meal_logs').insert({
    user_name: userName,
    meal_type: mealType,
    food_eaten: foodEaten,
    date: new Date().toISOString().split('T')[0]
  });
};

export const logWater = async (userName: string, glasses: number) => {
  await supabase.from('water_logs').upsert({
    user_name: userName,
    glasses,
    date: new Date().toISOString().split('T')[0]
  }, { onConflict: 'user_name,date' });
};