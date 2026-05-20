import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { GoogleAuth } from 'https://esm.sh/google-auth-library@9';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const serviceAccountJson = Deno.env.get('FCM_SERVICE_ACCOUNT')!;

Deno.serve(async () => {
  const supabase = createClient(supabaseUrl, supabaseKey);

  const hour = new Date().getUTCHours() + 5; // Pakistan time UTC+5

  let title = '';
  let body = '';

  if (hour === 9) {
  title = 'Time for breakfast! 🌅';
  body = 'Start your day with a nutritious meal!';
} else if (hour === 13) {
  title = "Don't forget lunch! ☀️";
  body = 'Keep your energy up!';
} else if (hour === 19) {
  title = 'Dinner time! 🌙';
  body = 'End your day with a good meal!';
} else {
  return new Response('Not a meal time', { status: 200 });
}

  const { data: tokens } = await supabase.from('fcm_tokens').select('token');

  if (!tokens || tokens.length === 0) {
    return new Response('No tokens found', { status: 200 });
  }

  const serviceAccount = JSON.parse(serviceAccountJson);
  const auth = new GoogleAuth({
    credentials: serviceAccount,
    scopes: ['https://www.googleapis.com/auth/firebase.messaging'],
  });

  const accessToken = await auth.getAccessToken();
  const projectId = serviceAccount.project_id;

  for (const { token } of tokens) {
    await fetch(`https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: {
          token,
          notification: { title, body },
        }
      }),
    });
  }

  return new Response(`Sent to ${tokens.length} devices`, { status: 200 });
});