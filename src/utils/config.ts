import 'dotenv-flow/config';

export const SUPABASE_URL = process.env.SUPABASE_URL!;
export const SUPABASE_KEY = process.env.SUPABASE_KEY!;
export const SUPABASE_ADMIN_KEY = process.env.SUPABASE_ADMIN_KEY!;
export const JWT_SECRET = process.env.JWT_SECRET!;

export const RESEND_KEY = process.env.RESEND_KEY!;

export const HASH_SECRET = process.env.HASH_SECRET!;
export const PORT = process.env.PORT || 9069;