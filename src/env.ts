interface Env {
  apiUrl: string;
  isDevelopment: boolean;

  contact: Contact;

  recaptcha: {
    clientKey: string;
    secretKey: string;
  };
}

export interface Contact {
  email: string;

  githubUsername: string;
  githubUrl: string;

  linkedinUsername: string;
  linkedinUrl: string;

  facebookUsername: string;
  facebookUrl: string;
}

export const getEnv = (): Env => ({
  apiUrl: process.env.API_URL ?? "",
  isDevelopment: process.env.NODE_ENV === "development",

  contact: {
    email: process.env.CONTACT_EMAIL ?? "",

    githubUsername: process.env.CONTACT_GITHUB_USERNAME ?? "",
    githubUrl: process.env.CONTACT_GITHUB_URL ?? "",

    linkedinUsername: process.env.CONTACT_LINKEDIN_USERNAME ?? "",
    linkedinUrl: process.env.CONTACT_LINKEDIN_URL ?? "",

    facebookUsername: process.env.CONTACT_FACEBOOK_USERNAME ?? "",
    facebookUrl: process.env.CONTACT_FACEBOOK_URL ?? ""
  },

  recaptcha: {
    clientKey: process.env.RECAPTCHA_CLIENT_KEY ?? "",
    secretKey: process.env.RECAPTCHA_SECRET_KEY ?? ""
  }
});
