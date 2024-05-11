import { Request, Response } from 'express';
import {supabase, supabaseAdmin, supabaseAuthClient} from '../utils/supabaseClient';
import {UserPayload} from "../models/userPayload";
import {unsubscribeTemplate} from "../utils/templates/unsubscribeTemplate";
import {resend} from "../utils/resendClient";
import {newsletterSubscribeEmailTemplate} from "../utils/templates/newsletterSubscribeEmailTemplate";
import {HASH_SECRET, JWT_SECRET} from "../utils/config";
import jwt from "jsonwebtoken";

export const subscribeToNewsletter = async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = res.locals.user as UserPayload;

  if (!user) {
    return res.status(401).json({ message: 'User data not found' });
  }

  const { data, error } = await supabaseAuthClient(req)
    .from('subscriptions')
    .insert([{
      newsletter_id: id,
      subscriber_id: user.sub,
      subscriber_email: user.email
    }])
    .select()
    .single();

  const newsletter = await supabaseAuthClient(req)
    .from('newsletters')
    .select("title, description")
    .eq('id', id)
    .single();


  if (error) {
    if (error.code === '42501'){
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.status(500).json({ message: 'Failed to subscribe to newsletter', error });
  }
  if(newsletter.error) {
    return res.status(500).json({ message: 'Failed to subscribe to newsletter', error });
  }

  await resend.emails.send({
    from: 'no-reply@tapeer.cz',
    to: user.email,
    subject: 'You have been subscribed to: ' + newsletter.data.title,
    html: newsletterSubscribeEmailTemplate(
      'http://localhost:9069/api/subscriptions/unsubscribe',
      user.email,
      newsletter.data.title,
      newsletter.data.description,
      id,
      user.sub
    ),
  });

  res.status(201).json(data);
};

export const unsubscribeFromNewsletter = async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token) {
    return res.status(401).json({ message: 'Token is required' });
  }

  try {
    const data = jwt.verify(token.toString(), HASH_SECRET) as any;
    const { newsletterId, userId } = data;

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .delete()
      .eq('newsletter_id', newsletterId)
      .eq('subscriber_id', userId)
      .single();

    if (error) {
      if (error.code === '42501'){
        return res.status(403).json({ message: 'Forbidden' });
      }
      return res.status(500).json({ message: 'Failed to unsubscribe', error });
    }

    } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(200).send(unsubscribeTemplate());
};

