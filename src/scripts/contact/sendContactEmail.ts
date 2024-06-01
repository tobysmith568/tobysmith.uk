import type { Fields } from "./parseFormData";

const headers: HeadersInit = {
  "Content-Type": "application/json"
};

export const sendContactEmail = async (fields: Fields, recaptchaToken: string) => {
  const { name, email, message } = fields;

  const body = JSON.stringify({ name, email, message, recaptchaToken });

  try {
    const response = await fetch("https://email.tobysmith.uk", {
      method: "POST",
      headers,
      body
    });

    if (!response.ok) {
      throw new Error("Message failed to send");
    }
  } catch (error) {
    console.error(error);
    throw new Error("Message failed to send");
  }
};
