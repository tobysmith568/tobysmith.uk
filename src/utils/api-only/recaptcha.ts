import { BadRequestException } from "next-api-handler";
import { postJSON } from "../http-request";
import { getEnv } from "./env";

// cspell:words siteverify

const secretKey = getEnv().recaptcha.secretKey;

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

  const res = await postJSON<undefined, Response>(url.href, undefined);

  if (!res.success) {
    const errorObj = { recaptchaErrorCodes: res["error-codes"] };
    const errorString = JSON.stringify(errorObj);

    throw new BadRequestException(errorString);
  }
};
