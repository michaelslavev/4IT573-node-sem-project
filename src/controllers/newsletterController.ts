import { Request, Response } from 'express';
import {supabase, supabaseAuthClient} from '../utils/supabaseClient';
import {UserPayload} from "../models/userPayload";

export const createNewsletterController = async (req: Request, res: Response) => {
  const { title, description } = req.body;
  const user = res.locals.user as UserPayload;


  if (!user) {
    return res.status(401).json({ message: 'User data not found' });
  }

  const { data, error } = await supabaseAuthClient(req)
    .from('newsletters')
    .insert([{
      title: title,
      description: description,
      editor_id: user.sub
    }])
    .select()
    .single();

  if (error) {
    if (error.code === '42501'){
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.status(500).json({ message: 'Failed to create newsletter', error });
  }

  res.status(201).json(data);
};

export const listNewslettersController = async (req: Request, res: Response) => {
  const { data, error } = await supabaseAuthClient(req)
    .from('newsletters')
    .select()
    .order('title', { ascending: true });

  if (error) {
    if (error.code === '42501'){
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.status(500).json({ message: 'Failed to fetch newsletters'});
  }

  res.status(200).json(data);
};

export const updateNewsletterController = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description } = req.body;

  const { data, error } = await supabaseAuthClient(req)
    .from('newsletters')
    .update({ title, description })
    .eq('id', id);

  if (error) {
    if (error.code === '42501'){
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.status(500).json({ message: 'Failed to update newsletter', error });
  }

  res.status(204).json({
    "status": 204,
    "statusText": "No Content"
  });
};

export const deleteNewsletterController = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { error } = await supabaseAuthClient(req)
    .from('newsletters')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ message: 'Failed to delete newsletter', error });
  }

  res.status(204).json({
    "status": 204,
    "statusText": "No Content"
  });
};
