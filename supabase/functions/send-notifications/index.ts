import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleAuth } from 'https://esm.sh/google-auth-library@9';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const serviceAccountJson = Deno.env.get('FCM_SERVICE_ACCOUNT')!;

const getMessages = (userName: string, mealTime: 'breakfast' | 'lunch' | 'dinner') => {
  const name = userName.toLowerCase().trim();
  const isEisha = ['eisha', 'begum'].includes(name);
  const isParents = ['abu', 'ammi'].includes(name);
  const isSiblings = ['ashi', 'mano'].includes(name);
  const isPanda = ['asad', 'kuchupuchu'].includes(name);

  
  if (isEisha) {
    return {
      breakfast: { title: 'Time for breakfast, Begum! ❤️', body: 'Start your day with something delicious 💕' },
      lunch: { title: "Don't forget lunch, Begum! ☀️", body: 'Wish we were together for lunch :)' },
      dinner: { title: 'Dinner time, Begum! 🌙', body: 'A great end to an amazing day ❤️' },
    }[mealTime];
  } else if (isParents) {
    return {
      breakfast: { title: 'ناشتے کا وقت ہو گیا! 🌅', body: 'ابو امّی، صحت مند ناشتہ کریں' },
      lunch: { title: 'لنچ کا وقت! ☀️', body: 'یار، لنچ میں کیا کھانا ہے؟' },
      dinner: { title: 'کھانے کا وقت! 🌙', body: 'امّی، کھانے میں کیا بنا ہے' },
    }[mealTime];
  } else if (isSiblings) {
    return {
      breakfast: { title: 'Bongas! Nashta time! 🌅', body: 'Bonga no 01 and Bonga no 02, nashta kar lia karo -_-' },
      lunch: { title: 'Lunch time, namoonas! ☀️', body: 'Have some lunch, you two namoonas' },
      dinner: { title: 'Dinner time! 🌙', body: 'Get some dinner for yourselves :)' },
    }[mealTime];
  } else if (isPanda) {
    return {
      breakfast: { title: 'Breakfast time! 🌅', body: 'Eat more fiber and protein, fam' },
      lunch: { title: 'Lunch time! ☀️', body: 'Eat something very light, like fruit' },
      dinner: { title: 'Dinner time! 🌙', body: 'Skipping meals won\'t be a bad thing for once 😑' },
    }[mealTime];
  } else {
    return {
      breakfast: { title: 'Time for breakfast! 🌅', body: 'Start your day with a nutritious meal!' },
      lunch: { title: "Don't forget lunch! ☀️", body: 'Keep your energy up!' },
      dinner: { title: 'Dinner time! 🌙', body: 'End your day with a good meal!' },
    }[mealTime];
  }
};

const getWaterMessage = (userName: string) => {
  const name = userName.toLowerCase().trim();
  const isEisha = ['eisha', 'begum'].includes(name);
  const isParents = ['abu', 'ammi'].includes(name);
  const isSiblings = ['ashi', 'mano'].includes(name);

  if (isEisha) return { title: 'Time to drink water, Begum! 💧', body: 'Stay hydrated my love 💕' };
  if (isParents) return { title: 'پانی پینے کا وقت! 💧', body: 'صحت مند رہیں، پانی پیتے رہیں' };
  if (isSiblings) return { title: 'Drink water, bongas! 💧', body: 'Stay hydrated you two namoonas' };
  return { title: 'Time to drink water! 💧', body: 'Stay hydrated throughout the day!' };
};

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  const hour = new Date().getUTCHours() + 5; // Pakistan time UTC+5

  let isWaterReminder = false;
  let mealTime: 'breakfast' | 'lunch' | 'dinner' | null = null;

  if (hour === 9) mealTime = 'breakfast';
  else if (hour === 13) mealTime = 'lunch';
  else if (hour === 19) mealTime = 'dinner';
  else if (hour >= 9 && hour <= 19) isWaterReminder = true;
  else return new Response('Outside notification hours', { status: 200 });

  const { data: tokens } = await supabase.from('fcm_tokens').select('token, user_name');
  if (!tokens || tokens.length === 0) return new Response('No tokens found', { status: 200 });

  const serviceAccount = JSON.parse(serviceAccountJson);
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  const accessToken = await auth.getAccessToken();
  const projectId = serviceAccount.project_id;

  for (const { token, user_name } of tokens) {
    const { title, body } = mealTime
      ? getMessages(user_name, mealTime)!
      : getWaterMessage(user_name);

    await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: { token, notification: { title, body } }
      }),
    });
  }
@keyframes floatUp {
  0% {
    transform: translateY(100vh) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) scale(1.2);
    opacity: 0;
  }
}

.heart-float {
  animation: floatUp linear infinite;
}
 return new Response(`Sent to ${tokens.length} devices`, { status: 200 });
});
