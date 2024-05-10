import { Request, Response } from 'express';
import { supabase } from '../utils/supabaseClient';

interface UserCredentials {
  email: string;
  password: string;
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password }: UserCredentials = req.body;

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (existingUser) {
    return res.status(401).json({ message: 'User already exists' });
  }


  const { data, error } = await supabase
    .auth
    .signUp({
      email: email,
      password: password
    });

  if (error) {
    return res.status(500).json({ message: 'Failed to register', error });
  }


  res.status(200).json({ message: 'User registered successfully' });
};


export const loginController = async (req: Request, res: Response) => {
  const { email, password }: UserCredentials = req.body;

  const { data, error } = await supabase
    .auth
    .signInWithPassword({
    email: email,
    password: password,
  })

  if (error) {
    return res.status(401).json({ message: 'Login failed' });
  }


  res.status(200).json({
    access_token: data.session?.access_token,
    token_type: 'bearer',
    expires_in: data.session?.expires_in,
    refresh_token: data.session?.refresh_token
  });
};


export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body;

  if (!refresh_token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .auth
    .refreshSession({
      refresh_token: refresh_token
    });

  if (error) {
    return res.status(401).json({ message: 'Token refresh failed: ', error });
  }


  res.status(200).json({
    access_token: data.session?.access_token,
    token_type: 'bearer',
    expires_in: data.session?.expires_in,
    refresh_token: data.session?.refresh_token
  });
};
