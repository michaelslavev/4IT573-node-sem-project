import { Request, Response } from 'express';
import {supabase, supabaseAdmin, supabaseAuthClient} from '../utils/supabaseClient';
import {resend} from "../utils/resendClient";
import {newPostEmailTemplate} from "../utils/templates/newPostEmailTemplate";

export const createPost = async (req: Request, res: Response) => {
  const { title, content, newsletterId } = req.body;

  const { data, error } = await supabaseAuthClient(req)
    .from('posts')
    .insert([{
      title: title,
      content: content,
      newsletter_id: newsletterId }]);

  if (error) {
    if (error.code === '42501'){
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.status(500).json({ message: 'Failed to create post', error });
  }

  const subscribers = await supabaseAuthClient(req)
    .from('subscriptions')
    .select('subscriber_email, subscriber_id')
    .eq('newsletter_id', newsletterId);

  const newsletter = await supabaseAuthClient(req)
    .from('newsletters')
    .select('title')
    .eq('id', newsletterId)
    .single();

  if (subscribers.error || newsletter.error) {
    return res.status(500).json({ message: 'Failed to fetch subscribers', error });
  }

  for (const subscriber of subscribers.data) {
    await resend.emails.send({
      from: 'newsletter@tapeer.cz',
      to: subscriber.subscriber_email,
      subject: 'New post in ' + newsletter.data.title,
      html: newPostEmailTemplate(
        'http://localhost:9069/api/subscriptions/unsubscribe',
        newsletter.data.title,
        title,
        content,
        newsletterId,
        subscriber.subscriber_id
      ),
    });
  }

  res.status(200).json(data);
};

export const listPosts = async (req: Request, res: Response) => {
  const { id } = req.params;

  const { data, error } = await supabaseAuthClient(req)
    .from('posts')
    .select('*')
    .eq('newsletter_id', id);

  if (error) {
    if (error.code === '42501'){
      return res.status(403).json({ message: 'Forbidden' });
    }
    return res.status(500).json({ message: 'Failed to fetch posts', error });
  }

  res.status(200).json(data);
};
