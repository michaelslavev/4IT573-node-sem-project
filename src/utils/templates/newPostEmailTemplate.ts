import jwt from "jsonwebtoken";
import {HASH_SECRET} from "../config";

export const newPostEmailTemplate = (
  unsubUrl: string,
  newsletterTitle: string,
  postTitle: string,
  postContent: string,
  newsletterId: string,
  userId: string): string => {

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
      <title>New post in ${newsletterTitle}</title>
    </head>
    <body>
      <h1>Hey there!</h1>
      <p>
        We are excited to announce a new post in ${newsletterTitle}:
      </p>
      <h2>${postTitle}</h2>
      <p>${postContent}</p>
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