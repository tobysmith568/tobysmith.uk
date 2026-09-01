import { ActionError, defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { getContactEnv } from "./contact/env";
import { sendPlainTextEmail } from "./contact/sendPlainTextEmail";
import { verifyTurnstileToken } from "./contact/verifyTurnstileToken";

export const server = {
  contact: defineAction({
    input: z.object({
      name: z.string().min(1, "The name field cannot be empty"),
      email: z
        .string()
        .min(1, "The email field cannot be empty")
        .email("The email field must be a valid email address"),
      message: z.string().min(1, "The message field cannot be empty"),
      turnstileToken: z.string().min(1, "The turnstileToken field is required")
    }),
    handler: async ({ name, email, message, turnstileToken }) => {
      const contactEnv = getContactEnv();

      const turnstileValidation = await verifyTurnstileToken(turnstileToken, contactEnv.turnstile);
      if (!turnstileValidation.success) {
        // As with the email-send failure below: log the real reason (which can be a raw
        // Turnstile error-code payload, not something to show a visitor) server-side, and give
        // the browser a clean, generic message instead.
        console.error("Contact form Turnstile verification failed:", turnstileValidation.error);
        throw new ActionError({
          code: "BAD_REQUEST",
          message: "Something went wrong verifying your submission. Please try again."
        });
      }

      const subject = `New message from ${name} via tobysmith.uk`;
      const text = `The following message is from ${name}, ${email}\n\n${message}`;

      const emailResult = await sendPlainTextEmail(name, subject, text, contactEnv.email, env.SEB);
      if (!emailResult.success) {
        // Log the underlying failure server-side (Worker tail logs); never surface the raw
        // error string - which can carry internal binding detail - to the browser.
        console.error("Contact form email send failed:", emailResult.error);
        throw new ActionError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong while sending your message. Please try again later."
        });
      }
    }
  })
};
