import { NextApiRequest } from "next";
import { RouterBuilder } from "next-api-handler";
import { z } from "zod";
import { getEnv } from "../../utils/api-only/env";
import parseBody from "../../utils/api-only/parse-body";
import { verifyRecaptchaToken } from "../../utils/api-only/recaptcha";
import { sendPlainTextEmail } from "../../utils/api-only/send-email";

const { from, to } = getEnv().email;

const postRequestValidator = z.object({
  name: z.string(),
  email: z.string(),
  message: z.string(),
  recaptchaToken: z.string()
});

export type SendEmailRequest = z.infer<typeof postRequestValidator>;

export type SendEmailResponse = {
  success: boolean;
};

const postHandler = async (req: NextApiRequest) => {
  const { name, email, message, recaptchaToken } = parseBody(req, postRequestValidator);

  await verifyRecaptchaToken(recaptchaToken);

  const subject = `New message from ${name} via tobysmith.uk`;
  const fullMessage = `The following message is from ${name}, ${email}\n\n${message}`;

  await sendPlainTextEmail(to, name, from, subject, fullMessage);
};

const router = new RouterBuilder();
router.post(postHandler);
export default router.build();
