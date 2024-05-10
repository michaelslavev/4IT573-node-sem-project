import 'dotenv-flow/config';

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_KEY!;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const PORT = process.env.PORT || 9069;