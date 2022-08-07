import { createTransport, Transporter } from "nodemailer";
import { getEnv } from "../../../src/utils/api-only/env";
// eslint-disable-next-line jest/no-mocks-import
import { defaultMockEnv } from "../../../src/utils/api-only/__mocks__/env";

jest.mock("../../../src/utils/api-only/env", () => ({
  getEnv: jest.fn()
}));
jest.mock("nodemailer");

describe("send-email", () => {
  let to = "";
  let fromName = "";
  let fromEmail = "";
  let subject = "";
  let text = "";

  const mockedCreateTransport = jest.mocked(createTransport);
  const mockedGetEnv = jest.mocked(getEnv);

  beforeEach(() => {
    jest.resetAllMocks();

    to = "to";
    fromName = "from name";
    fromEmail = "from@email";
    subject = "email subject";
    text = "email content";

    mockedGetEnv.mockReturnValue(defaultMockEnv);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("when the module is imported", () => {
    it("should create a transport with the host", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      expect(mockedCreateTransport).toHaveBeenCalledTimes(1);
      expect(mockedCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          host: defaultMockEnv.email.host
        })
      );
    });

    it("should create a transport with the port", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      expect(mockedCreateTransport).toHaveBeenCalledTimes(1);
      expect(mockedCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          port: defaultMockEnv.email.port
        })
      );
    });

    it("should create a transport with the secure flag set to true when the port is 465", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      expect(mockedCreateTransport).toHaveBeenCalledTimes(1);
      expect(mockedCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          secure: true
        })
      );
    });

    it("should create a transport with the secure flag set to false when the port is not 465", () => {
      const envWithNonSecurePort = defaultMockEnv;
      envWithNonSecurePort.email.port = 123;

      mockedGetEnv.mockReturnValue(envWithNonSecurePort);

      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      expect(mockedCreateTransport).toHaveBeenCalledTimes(1);
      expect(mockedCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          secure: false
        })
      );
    });

    it("should create a transport with the user", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      expect(mockedCreateTransport).toHaveBeenCalledTimes(1);
      expect(mockedCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          auth: expect.objectContaining({
            user: defaultMockEnv.email.user
          })
        })
      );
    });

    it("should create a transport with the pass", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      expect(mockedCreateTransport).toHaveBeenCalledTimes(1);
      expect(mockedCreateTransport).toHaveBeenCalledWith(
        expect.objectContaining({
          auth: expect.objectContaining({
            pass: defaultMockEnv.email.pass
          })
        })
      );
    });
  });

  describe("sendPlainTextEmail", () => {
    it("should pass the recipient to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      jest.isolateModules(async () => {
        const emailModule = require("../../../src/utils/api-only/send-email");

        await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);
      });

      const args = sendMailMock.mock.calls[0];
      expect(args[0].to).toBe(to);
    });

    it("should pass the subject to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      jest.isolateModules(async () => {
        const emailModule = require("../../../src/utils/api-only/send-email");

        await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);
      });

      const args = sendMailMock.mock.calls[0];
      expect(args[0].subject).toBe(subject);
    });

    it("should pass the text to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      jest.isolateModules(async () => {
        const emailModule = require("../../../src/utils/api-only/send-email");

        await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);
      });

      const args = sendMailMock.mock.calls[0];
      expect(args[0].text).toBe(text);
    });

    it("should pass the formatted from to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      jest.isolateModules(async () => {
        const emailModule = require("../../../src/utils/api-only/send-email");

        await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);
      });

      const args = sendMailMock.mock.calls[0];
      expect(args[0].from).toBe(`${fromName} <${fromEmail}>`);
    });
  });
});
