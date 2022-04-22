import { Env, getEnv } from "../../../src/utils/api-only/env";
import { postJSON } from "../../../src/utils/http-request";

// cspell:words siteverify

const secretKey = "1234567890";
const token = "abcdefg";

jest.mock("../../../src/utils/http-request");
jest.mock("../../../src/utils/api-only/env");

describe("recaptcha", () => {
  const mockedPostJSON = jest.mocked(postJSON);
  const mockedGetEnv = jest.mocked(getEnv);

  beforeEach(() => jest.resetAllMocks());
  afterAll(() => jest.restoreAllMocks());

  describe("verifyRecaptchaToken", () => {
    beforeEach(() => {
      mockedGetEnv.mockReturnValue({
        recaptcha: { secretKey }
      } as Env);
    });

    it("should post a request to the Google recaptcha endpoint", async () => {
      mockedPostJSON.mockResolvedValue({
        success: true
      });

      await callVerifyRecaptchaTokenInIsolation(token);

      expect(mockedPostJSON).toHaveBeenCalledTimes(1);

      const urlStringPostedTo = mockedPostJSON.mock.calls[0][0];
      const urlPostedTo = new URL(urlStringPostedTo);

      expect(urlPostedTo.protocol).toBe("https:");
      expect(urlPostedTo.hostname).toBe("www.google.com");
      expect(urlPostedTo.pathname).toBe("/recaptcha/api/siteverify");
    });

    it("should post a request to the Google recaptcha endpoint with the secret", async () => {
      mockedPostJSON.mockResolvedValue({
        success: true
      });

      await callVerifyRecaptchaTokenInIsolation(token);

      expect(mockedPostJSON).toHaveBeenCalledTimes(1);

      const urlStringPostedTo = mockedPostJSON.mock.calls[0][0];
      const urlPostedTo = new URL(urlStringPostedTo);
      const params = urlPostedTo.searchParams;

      expect(params.get("secret")).toBe(secretKey);
    });

    it("should post a request to the Google recaptcha endpoint with the response token", async () => {
      mockedPostJSON.mockResolvedValue({
        success: true
      });

      await callVerifyRecaptchaTokenInIsolation(token);

      expect(mockedPostJSON).toHaveBeenCalledTimes(1);

      const urlStringPostedTo = mockedPostJSON.mock.calls[0][0];
      const urlPostedTo = new URL(urlStringPostedTo);
      const params = urlPostedTo.searchParams;

      expect(params.get("response")).toBe(token);
    });

    it("should not throw if the post returns with success", async () => {
      mockedPostJSON.mockResolvedValue({
        success: true
      });

      await expect(callVerifyRecaptchaTokenInIsolation(token)).resolves.not.toThrow();
    });

    it("should throw if the post returns with failure", async () => {
      mockedPostJSON.mockResolvedValue({
        success: false
      });

      await expect(callVerifyRecaptchaTokenInIsolation(token)).rejects.toThrow();
    });

    it("should throw the recaptcha error codes if the post returns with failure and error codes", async () => {
      const errorCode1 = "invalid-input-response";
      const errorCode2 = "invalid-input-secret";
      const expectedJsonString = `{"recaptchaErrorCodes":["${errorCode1}","${errorCode2}"]}`;

      mockedPostJSON.mockResolvedValue({
        success: false,
        "error-codes": [errorCode1, errorCode2]
      });

      await expect(callVerifyRecaptchaTokenInIsolation(token)).rejects.toThrow(expectedJsonString);
    });
  });
});

const callVerifyRecaptchaTokenInIsolation = async (tokenToCallWith: string): Promise<void> =>
  new Promise((resolve, reject) => {
    jest.isolateModules(async () => {
      const recaptchaModule = require("../../../src/utils/api-only/recaptcha");
      recaptchaModule.verifyRecaptchaToken(tokenToCallWith).then(resolve).catch(reject);
    });
  });
