import { createTransport, Transporter } from "nodemailer";
import { Env, getEnv } from "../../../src/utils/api-only/env";

jest.mock("../../../src/utils/api-only/env");
jest.mock("nodemailer");

describe("email", () => {
  let host = "";
  let port = 0;
  let user = "";
  let pass = "";
  let from = "";
  let to = "";

  let fromName = "";
  let fromEmail = "";
  let subject = "";
  let text = "";

  let mockedCreateTransport = jest.mocked(createTransport);
  let mockedGetEnv = jest.mocked(getEnv);

  beforeEach(() => {
    jest.resetAllMocks();

    host = "host";
    port = 465;
    user = "user";
    pass = "pass";
    from = "from";
    to = "to";

    fromName = "from name";
    fromEmail = "from@email";
    subject = "email subject";
    text = "email content";

    mockedGetEnv.mockReturnValue({
      email: {
        host,
        port,
        user,
        pass,
        from,
        to
      }
    } as Env);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("when the module is imported", () => {
    it("should create a transport with the host", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      const args = mockedCreateTransport.mock.calls[0] as any;
      expect(args[0].host).toBe(host);
    });

    it("should create a transport with the port", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      const args = mockedCreateTransport.mock.calls[0] as any;
      expect(args[0].port).toBe(port);
    });

    it("should create a transport with the secure flag set to true when the port is 465", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      const args = mockedCreateTransport.mock.calls[0] as any;
      expect(args[0].secure).toBe(true);
    });

    it("should create a transport with the secure flag set to false when the port is not 465", () => {
      mockedGetEnv.mockReturnValue({
        email: {
          host,
          port: 123,
          user,
          pass,
          from,
          to
        }
      } as Env);

      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      const args = mockedCreateTransport.mock.calls[0] as any;
      expect(args[0].secure).toBe(false);
    });

    it("should create a transport with the user", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      const args = mockedCreateTransport.mock.calls[0] as any;
      expect(args[0].auth.user).toBe(user);
    });

    it("should create a transport with the pass", () => {
      jest.isolateModules(() => {
        require("../../../src/utils/api-only/send-email");
      });

      const args = mockedCreateTransport.mock.calls[0] as any;
      expect(args[0].auth.pass).toBe(pass);
    });
  });

  describe("sendPlainTextEmail", () => {
    it("should pass the recipient to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      let emailModule: any;
      jest.isolateModules(() => {
        emailModule = require("../../../src/utils/api-only/send-email");
      });

      await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);

      const args = sendMailMock.mock.calls[0];
      expect(args[0].to).toBe(to);
    });

    it("should pass the subject to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      let emailModule: any;
      jest.isolateModules(() => {
        emailModule = require("../../../src/utils/api-only/send-email");
      });

      await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);

      const args = sendMailMock.mock.calls[0];
      expect(args[0].subject).toBe(subject);
    });

    it("should pass the text to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      let emailModule: any;
      jest.isolateModules(() => {
        emailModule = require("../../../src/utils/api-only/send-email");
      });

      await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);

      const args = sendMailMock.mock.calls[0];
      expect(args[0].text).toBe(text);
    });

    it("should pass the formatted from to the mail transport", async () => {
      const sendMailMock = jest.fn();

      mockedCreateTransport.mockReturnValue({
        sendMail: sendMailMock
      } as unknown as Transporter<unknown>);

      let emailModule: any;
      jest.isolateModules(() => {
        emailModule = require("../../../src/utils/api-only/send-email");
      });

      await emailModule.sendPlainTextEmail(to, fromName, fromEmail, subject, text);

      const args = sendMailMock.mock.calls[0];
      expect(args[0].from).toBe(`${fromName} <${fromEmail}>`);
    });
  });
});
