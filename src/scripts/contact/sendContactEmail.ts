import { actions } from "astro:actions";
import type { Fields } from "./parseFormData";

export const sendContactEmail = async (fields: Fields, recaptchaToken: string) => {
  const { error } = await actions.contact({ ...fields, recaptchaToken });

  if (error) {
    throw new Error(error.message);
  }
};
