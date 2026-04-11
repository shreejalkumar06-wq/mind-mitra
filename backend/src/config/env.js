import dotenv from 'dotenv';

dotenv.config();

const required = ['SUPABASE_URL'];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.SUPABASE_ANON_KEY;

if (!supabaseKey) {
  throw new Error(
    'Missing Supabase key. Set SUPABASE_SERVICE_ROLE_KEY, SUPABASE_PUBLISHABLE_KEY, or SUPABASE_ANON_KEY.'
  );
}

const frontendOrigins = (
  process.env.FRONTEND_URLS ||
  process.env.FRONTEND_URL ||
  'http://localhost:3000'
)
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const env = {
  port: Number(process.env.PORT || 4000),
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseKey,
  frontendOrigins,
  socketPath: process.env.SOCKET_PATH || '/socket.io',
};
