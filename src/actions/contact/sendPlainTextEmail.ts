import { EmailMessage } from "cloudflare:email";
import { createMimeMessage } from "mimetext";

type Success = { success: true };
type Failure = { success: false; error: string };
type SendEmailResult = Success | Failure;

export const sendPlainTextEmail = async (
  fromName: string,
  subject: string,
  message: string,
  email: { to: string; from: string },
  seb: SendEmail
): Promise<SendEmailResult> => {
  const { to, from } = email;

  const msg = createMimeMessage();
  msg.setSender({ name: fromName, addr: from });
  msg.setRecipient({ name: "Toby Smith", addr: to });
  msg.setSubject(subject);
  msg.addMessage({
    contentType: "text/plain",
    data: message
  });

  const emailMessage = new EmailMessage(from, to, msg.asRaw());

  try {
    await seb.send(emailMessage);
    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.toString() };
    }

    if (typeof error === "string") {
      return { success: false, error };
    }

    return { success: false, error: "An unknown error occurred" };
  }
};
