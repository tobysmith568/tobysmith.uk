import { NextApiRequest, NextApiResponse } from "next";
import sendEmail from "../../../src/pages/api/send-email";
import { verifyRecaptchaToken } from "../../../src/utils/api-only/recaptcha";
import { sendPlainTextEmail } from "../../../src/utils/api-only/send-email";
import { defaultMockEnv } from "../../../src/utils/api-only/__mocks__/env";

jest.mock("../../../src/utils/api-only/env");
// jest.mock("../../../src/utils/api-only/parse-body");
jest.mock("../../../src/utils/api-only/recaptcha");
jest.mock("../../../src/utils/api-only/send-email");

const nonPostHttpMethods = ["GET", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];

describe("send-email", () => {
  const mockedSendPlainTextEmail = jest.mocked(sendPlainTextEmail);
  const mockedVerifyRecaptchaToken = jest.mocked(verifyRecaptchaToken);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterAll(() => jest.restoreAllMocks());

  nonPostHttpMethods.forEach(method =>
    it(`should reject http methods other than post: ${method}`, async () => {
      const req = {
        method
      } as NextApiRequest;

      const res = createMockRes();

      await sendEmail(req, res);

      expect(res.status).toHaveBeenCalledWith(405);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: `Method ${method} Not Allowed`
      });
    })
  );

  it("should reject posts without a body", async () => {
    const req = {
      method: "POST"
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Request Body: Required"
    });
  });

  it("should reject posts without a name", async () => {
    const req = {
      method: "POST",
      body: {
        email: "email",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Field 'name': Required"
    });
  });

  it("should reject posts without an email", async () => {
    const req = {
      method: "POST",
      body: {
        name: "name",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Field 'email': Required"
    });
  });

  it("should reject posts without a message", async () => {
    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Field 'message': Required"
    });
  });

  it("should reject posts without a recaptcha token", async () => {
    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        message: "message"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Field 'recaptchaToken': Required"
    });
  });

  it("should try to validate the given recaptcha token", async () => {
    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(mockedVerifyRecaptchaToken).toHaveBeenCalledWith(req.body.recaptchaToken);
  });

  it("should reject posts if the recaptcha token is invalid", async () => {
    const recaptchaErrorMessage = "recaptchaErrorMessage";

    mockedVerifyRecaptchaToken.mockRejectedValue(new Error(recaptchaErrorMessage));

    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: recaptchaErrorMessage
    });
  });

  it("should not try to send the email if the recaptcha is invalid", async () => {
    const recaptchaErrorMessage = "recaptchaErrorMessage";

    mockedVerifyRecaptchaToken.mockRejectedValue(new Error(recaptchaErrorMessage));

    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(mockedSendPlainTextEmail).not.toHaveBeenCalled();
  });

  it("should try to send the email if the recaptcha is valid", async () => {
    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(mockedSendPlainTextEmail).toHaveBeenCalledTimes(1);
  });

  it("should try to send the email with the correct details", async () => {
    const name = "name";
    const email = "email";
    const message = "message";

    const req = {
      method: "POST",
      body: {
        name,
        email,
        message,
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(mockedSendPlainTextEmail).toHaveBeenCalledWith(
      defaultMockEnv.email.to,
      "name",
      defaultMockEnv.email.from,
      `New message from ${name} via tobysmith.uk`,
      `The following message is from ${name}, ${email}\n\n${message}`
    );
  });

  it("should return no errors or data if the email sends successfully", async () => {
    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: undefined
    });
  });

  it("should return an error if the email fails to send", async () => {
    const emailErrorMessage = "emailErrorMessage";

    mockedSendPlainTextEmail.mockRejectedValue(new Error(emailErrorMessage));

    const req = {
      method: "POST",
      body: {
        name: "name",
        email: "email",
        message: "message",
        recaptchaToken: "recaptchaToken"
      }
    } as NextApiRequest;

    const res = createMockRes();

    await sendEmail(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: emailErrorMessage
    });
  });
});

const createMockRes = () => {
  const res: NextApiResponse = {} as unknown as NextApiResponse;

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn().mockReturnValue(res);

  return res;
};
