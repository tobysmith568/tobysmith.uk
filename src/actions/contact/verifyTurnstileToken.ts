type Success = { success: true };
type Failure = { success: false; error: string };
type ValidationResult = Success | Failure;

interface TurnstileResponse {
  success: boolean;
  challenge_ts: string;
  hostname: string;
  "error-codes": string[];
}

export const verifyTurnstileToken = async (
  token: string,
  turnstile: { secretKey: string; endpoint: string }
): Promise<ValidationResult> => {
  const res = await fetch(turnstile.endpoint, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      secret: turnstile.secretKey,
      response: token
    })
  });

  if (!res.ok) {
    return { success: false, error: "Failed to verify turnstile token" };
  }

  const resBody = (await res.json()) as TurnstileResponse;

  if (!resBody.success) {
    return {
      success: false,
      error: JSON.stringify({ turnstileErrorCodes: resBody["error-codes"] })
    };
  }

  return { success: true };
};
