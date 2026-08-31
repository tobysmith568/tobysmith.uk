import { z } from "zod";

// Messages match the contact Action's own input schema (src/actions/index.ts) - the same
// field, the same rule, should read the same whichever layer catches it.
const fieldsValidator = z.object({
  name: z.string().min(1, "The name field cannot be empty"),
  email: z
    .string()
    .min(1, "The email field cannot be empty")
    .email("The email field must be a valid email address"),
  message: z.string().min(1, "The message field cannot be empty")
});

export type Fields = z.infer<typeof fieldsValidator>;

export const parseFormData = (form: FormData) => {
  const fields = Object.fromEntries(form.entries());

  const parsedFields = fieldsValidator.safeParse(fields);

  if (!parsedFields.success) {
    console.error("Invalid field data", parsedFields.error);
    // Surface the specific problem (e.g. "The email field must be a valid email address")
    // rather than a generic "something's wrong" - the submit button only checks the fields
    // aren't empty, not that they're valid, so this is reachable (a malformed email, say).
    const message =
      parsedFields.error.issues[0]?.message ?? "Please check your details and try again.";
    throw new Error(message);
  }

  return parsedFields.data;
};

export const isFormValid = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  const fields = Object.fromEntries(formData.entries());

  return fieldsValidator.safeParse(fields).success;
};
