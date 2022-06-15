import { Env } from "../env";

export const defaultMockEnv: Env = {
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
    port: 465,
    user: "email user",
    pass: "email pass",
    to: "email to",
    from: "email from"
  },

  disqus: {
    shortName: "disqus shortname",
    blogUrl: "https://blog.url"
  }
};

export const getEnv = () => defaultMockEnv;
