import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from './supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ArrowLeft } from 'lucide-react';

export default function Reports() {
  const navigate = useNavigate();
  const [mealData, setMealData] = useState<any[]>([]);
  const [waterData, setWaterData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('dailyNourish');
    if (saved) {
      const data = JSON.parse(saved);
      setUserName(data.name || '');
    }
  }, []);

  useEffect(() => {
    if (!userName) return;
    fetchData();
  }, [userName]);

  const fetchData = async () => {
    setLoading(true);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

    const { data: meals } = await supabase
      .from('meal_logs')
      .select('date, meal_type')
      .eq('user_name', userName)
      .gte('date', fromDate)
      .order('date', { ascending: true });

    const { data: water } = await supabase
      .from('water_logs')
      .select('date, glasses')
      .eq('user_name', userName)
      .gte('date', fromDate)
      .order('date', { ascending: true });

    // Process meal data — count meals per day
    const mealMap: Record<string, number> = {};
    meals?.forEach(({ date }) => {
      mealMap[date] = (mealMap[date] || 0) + 1;
    });

    const processedMeals = Object.entries(mealMap).map(([date, count]) => ({
      date: date.slice(5), // MM-DD
      meals: count
    }));

    setMealData(processedMeals);
    setWaterData(water?.map(({ date, glasses }) => ({
      date: date.slice(5),
      glasses
    })) || []);

    setLoading(false);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#fef3f3] to-[#f0f4ff] flex flex-col items-center justify-start p-6">
      <div className="w-full max-w-md space-y-6 py-8">

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm hover:shadow-md transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-[#5a5a7a]" />
          </button>
          <h1 className="text-2xl text-[#5a5a7a]">Monthly Report</h1>
        </div>

        {loading ? (
          <div className="text-center text-[#9a9ab5] py-20">Loading your data...</div>
        ) : mealData.length === 0 ? (
          <div className="text-center text-[#9a9ab5] py-20">No data yet — start logging meals!</div>
        ) : (
          <>
            <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-md border border-white/60">
              <p className="text-sm font-medium text-[#5a5a7a] mb-4">Meals Logged per Day</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={mealData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9a9ab5' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#9a9ab5' }} />
                  <Tooltip />
                  <Bar dataKey="meals" fill="#d4b3ff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="w-full bg-white/80 backdrop-blur-sm rounded-3xl p-5 shadow-md border border-white/60">
              <p className="text-sm font-medium text-[#5a5a7a] mb-4">Water Intake per Day</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={waterData}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9a9ab5' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#9a9ab5' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="glasses" stroke="#87ceeb" strokeWidth={2} dot={{ fill: '#87ceeb' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}