import { actions } from "astro:actions";
import type { Fields } from "./parseFormData";

export const sendContactEmail = async (fields: Fields, turnstileToken: string) => {
  const { error } = await actions.contact({ ...fields, turnstileToken });

  if (error) {
    throw new Error(error.message);
  }
};
