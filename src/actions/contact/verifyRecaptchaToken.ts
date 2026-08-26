type Success = { success: true };
type Failure = { success: false; error: string };
type ValidationResult = Success | Failure;

interface RecaptchaResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
}

export const verifyRecaptchaToken = async (
  token: string,
  recaptcha: { secretKey: string; endpoint: string }
): Promise<ValidationResult> => {
  const url = new URL(recaptcha.endpoint);
  url.searchParams.append("secret", recaptcha.secretKey);
  url.searchParams.append("response", token);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8"
    }
  });

  if (!res.ok) {
    return { success: false, error: "Failed to verify recaptcha token" };
  }

  const resBody = (await res.json()) as RecaptchaResponse;

  if (!resBody.success) {
    return {
      success: false,
      error: JSON.stringify({ recaptchaErrorCodes: resBody["error-codes"] })
    };
  }

  return { success: true };
};
