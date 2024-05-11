import {HASH_SECRET} from "../config";
import jwt from "jsonwebtoken";

export const newsletterSubscribeEmailTemplate = (
  unsubUrl: string,
  email: string,
  newsletterTitle: string,
  newsletterDescription: string,
  newsletterId: string,
  userId: string): string=> {

  const token = jwt.sign(
    { newsletterId, userId },
    HASH_SECRET,
    { expiresIn: '360d' }
  );

  return `    
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <title>You were subscribed to ${newsletterTitle}</title>
    </head>
    <body>
      <h1>Welcome to the club!</h1>
      <p>
        We are excited to have you on board and look forward to bringing you the
        latest updates directly to your inbox.
      </p>
      <p>If you have any questions, feel free to contact us anytime.</p>
      <hr />
      <footer>
        <p>
          If you wish to unsubscribe and stop receiving these emails, please click
          on the link below:
        </p>
        <p>
          <a
            href="${unsubUrl}?token=${token}"
            style="color: #1155cc"
            >Unsubscribe</a
          >
        </p>
      </footer>
    </body>
  </html>`;
}