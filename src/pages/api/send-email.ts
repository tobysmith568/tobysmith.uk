import { NextApiRequest } from "next";
import { RouterBuilder } from "next-api-handler";
import { getEnv } from "../../utils/api-only/env";
import { verifyRecaptchaToken } from "../../utils/api-only/recaptcha";
import { sendPlainTextEmail } from "../../utils/api-only/send-email";

export interface SubmitRequest {
  name: string;
  email: string;
  message: string;
  recaptchaToken: string;
}

export interface SubmitResponse {
  success: boolean;
}

const postHandler = async (req: NextApiRequest) => {
  const { name, email, message, recaptchaToken } = getPostBody(req);
  const { from, to } = getEnv().email;

  const subject = `New message from ${name} via tobysmith.uk`;
  const fullMessage = `The following message is from ${name}, ${email}\n\n${message}`;

  await verifyRecaptchaToken(recaptchaToken);

  await sendPlainTextEmail(to, name, from, subject, fullMessage);
};

const getPostBody = (req: NextApiRequest): SubmitRequest => {
  const body = req.body as Partial<SubmitRequest>;

  if (!body?.name || typeof body.name !== "string") {
    throw new Error("No name was given or it wasn't a string.");
  }

  if (!body?.email || typeof body.email !== "string") {
    throw new Error("No email was given or it wasn't a string.");
  }

  if (!body?.message || typeof body.message !== "string") {
    throw new Error("No message was given or it wasn't a string.");
  }

  if (!body?.recaptchaToken || typeof body.recaptchaToken !== "string") {
    throw new Error("No recaptchaToken was given or it wasn't a string.");
  }

  return req.body;
};

const router = new RouterBuilder();
router.post(postHandler);
export default router.build();
