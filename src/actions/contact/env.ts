import { env } from "cloudflare:workers";
import { z } from "zod";

const envValidator = z
  .object({
    TURNSTILE_SECRET_KEY: z.string().min(1),
    TURNSTILE_ENDPOINT: z.string().min(1),

    EMAIL_TO: z.string().min(1).email(),
    EMAIL_FROM: z.string().min(1).email()
  })
  .transform(obj => ({
    turnstile: {
      secretKey: obj.TURNSTILE_SECRET_KEY,
      endpoint: obj.TURNSTILE_ENDPOINT
    },
    email: {
      to: obj.EMAIL_TO,
      from: obj.EMAIL_FROM
    }
  }));

export type ContactEnv = z.infer<typeof envValidator>;

export const getContactEnv = (): ContactEnv => envValidator.parse(env);
