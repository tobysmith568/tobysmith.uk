import { postJSON } from "../http-request";
import { getEnv } from "./env";

const secretKey = getEnv().recaptcha.secretKey;

interface Request {
  secret: string;
  response: string;
}

interface Response {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
}

export const verifyRecaptchaToken = async (token: string): Promise<void> => {
  const url = new URL("https://www.google.com/recaptcha/api/siteverify");
  url.searchParams.append("secret", secretKey);
  url.searchParams.append("response", token);

  const request: Request = {
    response: token,
    secret: secretKey
  };

  const res = await postJSON<Request, Response>(url.href, request);

  if (!res.success) {
    const errorObj = { recaptchaErrorCodes: res["error-codes"] };
    const errorString = JSON.stringify(errorObj);

    throw new Error(errorString);
  }
};
