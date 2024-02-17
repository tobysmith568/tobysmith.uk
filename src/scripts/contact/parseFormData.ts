import { z } from "zod";

const fieldsValidator = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1)
});

export type Fields = z.infer<typeof fieldsValidator>;

export const parseFormData = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  const fields = Object.fromEntries(formData.entries());

  const parsedFields = fieldsValidator.safeParse(fields);

  if (!parsedFields.success) {
    console.error("Invalid field data", parsedFields.error);
    throw new Error("Invalid field data");
  }

  return parsedFields.data;
};

export const isFormValid = (form: HTMLFormElement) => {
  const formData = new FormData(form);
  const fields = Object.fromEntries(formData.entries());

  return fieldsValidator.safeParse(fields).success;
}
