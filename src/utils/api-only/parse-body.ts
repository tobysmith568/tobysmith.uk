import { NextApiRequest } from "next";
import { BadRequestException } from "next-api-handler";
import { ZodType, z } from "zod";

const parseBody = <TBody>(req: NextApiRequest, validator: ZodType<TBody>): TBody => {
  const parseResult = validator.safeParse(req.body);

  if (parseResult.success) {
    return parseResult.data;
  }

  const flatMessages = parseResult.error.flatten();

  const allMessages: string[] = [];

  for (const formError of flatMessages.formErrors) {
    allMessages.push("Request Body: " + formError);
  }

  for (const fieldName in flatMessages.fieldErrors) {
    type KeyType = keyof z.inferFlattenedErrors<ZodType<TBody>>["fieldErrors"];

    const fieldErrors = flatMessages.fieldErrors[fieldName as KeyType];

    if (!fieldErrors) {
      continue;
    }

    for (const fieldError of fieldErrors) {
      allMessages.push(`Field '${fieldName}': ${fieldError}`);
    }
  }

  const combinedMessage = allMessages.join(". ");

  throw new BadRequestException(combinedMessage);
};
export default parseBody;
