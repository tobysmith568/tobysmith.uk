import { createTransport } from "nodemailer";
import { getEnv } from "./env";

const securePort = 465;
const { host, port, user, pass } = getEnv().email;

const transporter = createTransport({
  host,
  port,
  secure: port === securePort,
  auth: {
    user,
    pass
  }
});

export const sendPlainTextEmail = async (
  to: string,
  fromName: string,
  fromEmail: string,
  subject: string,
  text: string
): Promise<void> => {
  const from = `${fromName} <${fromEmail}>`;

  await transporter.sendMail({
    from,
    to,
    subject,
    text
  });
};
