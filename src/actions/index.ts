import { ActionError, defineAction } from "astro:actions";
import { env } from "cloudflare:workers";
import { z } from "zod";
import { getContactEnv } from "./contact/env";
import { sendPlainTextEmail } from "./contact/sendPlainTextEmail";
import { verifyRecaptchaToken } from "./contact/verifyRecaptchaToken";

export const server = {
  contact: defineAction({
    input: z.object({
      name: z.string().min(1, "The name field cannot be empty"),
      email: z
        .string()
        .min(1, "The email field cannot be empty")
        .email("The email field must be a valid email address"),
      message: z.string().min(1, "The message field cannot be empty"),
      recaptchaToken: z.string().min(1, "The recaptchaToken field is required")
    }),
    handler: async ({ name, email, message, recaptchaToken }) => {
      const contactEnv = getContactEnv();

      const recaptchaValidation = await verifyRecaptchaToken(recaptchaToken, contactEnv.recaptcha);
      if (!recaptchaValidation.success) {
        throw new ActionError({ code: "BAD_REQUEST", message: recaptchaValidation.error });
      }

      const subject = `New message from ${name} via tobysmith.uk`;
      const text = `The following message is from ${name}, ${email}\n\n${message}`;

      const emailResult = await sendPlainTextEmail(name, subject, text, contactEnv.email, env.SEB);
      if (!emailResult.success) {
        throw new ActionError({ code: "INTERNAL_SERVER_ERROR", message: emailResult.error });
      }
    }
  })
};
