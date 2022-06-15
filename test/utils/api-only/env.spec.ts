import { Env, getEnv } from "../../../src/utils/api-only/env";

describe("env utils", () => {
  let originalEnv: any;

  beforeAll(() => {
    originalEnv = process.env;
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe("getEnv", () => {
    it("should return the populated environment variables", () => {
      process.env.API_URL = "https://api.url";
      //process.env.NODE_ENV = "development"; // Omitted because it is read-only
      process.env.CONTACT_EMAIL = "contact@email";
      process.env.CONTACT_GITHUB_USERNAME = "github username";
      process.env.CONTACT_GITHUB_URL = "https://github.url";
      process.env.CONTACT_LINKEDIN_USERNAME = "linkedin username";
      process.env.CONTACT_LINKEDIN_URL = "https://linkedin.url";
      process.env.CONTACT_FACEBOOK_USERNAME = "facebook username";
      process.env.CONTACT_FACEBOOK_URL = "facebook.url";
      process.env.RECAPTCHA_CLIENT_KEY = "recaptcha client key";
      process.env.RECAPTCHA_SECRET_KEY = "recaptcha secret key";
      process.env.EMAIL_HOST = "email host";
      process.env.EMAIL_PORT = "123";
      process.env.EMAIL_USER = "user";
      process.env.EMAIL_PASS = "pass";
      process.env.EMAIL_TO = "email to";
      process.env.EMAIL_FROM = "email from";
      process.env.DISQUS_SHORT_NAME = "disqus short name";
      process.env.DISQUS_BLOG_URL = "disqus blog url";

      const result = getEnv();

      const expectedEnv: Env = {
        apiUrl: "https://api.url",
        isDevelopment: false,

        contact: {
          email: "contact@email",

          githubUsername: "github username",
          githubUrl: "https://github.url",

          linkedinUsername: "linkedin username",
          linkedinUrl: "https://linkedin.url",

          facebookUsername: "facebook username",
          facebookUrl: "facebook.url"
        },

        recaptcha: {
          clientKey: "recaptcha client key",
          secretKey: "recaptcha secret key"
        },

        email: {
          host: "email host",
          port: 123,
          user: "user",
          pass: "pass",
          to: "email to",
          from: "email from"
        },

        disqus: {
          shortName: "disqus short name",
          blogUrl: "disqus blog url"
        }
      };

      expect(result).toEqual(expectedEnv);
    });

    it("should return default values when options aren't populated", () => {
      process.env.API_URL = "";
      //process.env.NODE_ENV = ""; // Omitted because it is read-only
      process.env.CONTACT_EMAIL = "";
      process.env.CONTACT_GITHUB_USERNAME = "";
      process.env.CONTACT_GITHUB_URL = "";
      process.env.CONTACT_LINKEDIN_USERNAME = "";
      process.env.CONTACT_LINKEDIN_URL = "";
      process.env.CONTACT_FACEBOOK_USERNAME = "";
      process.env.CONTACT_FACEBOOK_URL = "";
      process.env.RECAPTCHA_CLIENT_KEY = "";
      process.env.RECAPTCHA_SECRET_KEY = "";
      process.env.EMAIL_HOST = "";
      process.env.EMAIL_PORT = "";
      process.env.EMAIL_USER = "";
      process.env.EMAIL_PASS = "";
      process.env.EMAIL_TO = "";
      process.env.EMAIL_FROM = "";
      process.env.DISQUS_SHORT_NAME = "";
      process.env.DISQUS_BLOG_URL = "";

      const result = getEnv();

      const expectedEnv: Env = {
        apiUrl: "",
        isDevelopment: false,

        contact: {
          email: "",

          githubUsername: "",
          githubUrl: "",

          linkedinUsername: "",
          linkedinUrl: "",

          facebookUsername: "",
          facebookUrl: ""
        },

        recaptcha: {
          clientKey: "",
          secretKey: ""
        },

        email: {
          host: "",
          port: 465,
          user: "",
          pass: "",
          to: "",
          from: ""
        },

        disqus: {
          shortName: "",
          blogUrl: ""
        }
      };

      expect(result).toEqual(expectedEnv);
    });
  });
});
