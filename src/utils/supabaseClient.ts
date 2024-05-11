import { createClient } from '@supabase/supabase-js';
import {SUPABASE_ADMIN_KEY, SUPABASE_KEY, SUPABASE_URL} from "./config";
import {Request} from "express";



export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ADMIN_KEY);

export const supabaseAuthClient = (req: Request) => createClient(
  SUPABASE_URL,
  SUPABASE_KEY,
  {
    global: {
      headers: { Authorization: req.headers['authorization']! },
    },
  }
);
