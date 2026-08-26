import { env } from "cloudflare:workers";
import { z } from "zod";

const envValidator = z
  .object({
    RECAPTCHA_SECRET_KEY: z.string().min(1),
    RECAPTCHA_ENDPOINT: z.string().min(1),

    EMAIL_TO: z.string().min(1).email(),
    EMAIL_FROM: z.string().min(1).email()
  })
  .transform(obj => ({
    recaptcha: {
      secretKey: obj.RECAPTCHA_SECRET_KEY,
      endpoint: obj.RECAPTCHA_ENDPOINT
    },
    email: {
      to: obj.EMAIL_TO,
      from: obj.EMAIL_FROM
    }
  }));

export type ContactEnv = z.infer<typeof envValidator>;

export const getContactEnv = (): ContactEnv => envValidator.parse(env);
