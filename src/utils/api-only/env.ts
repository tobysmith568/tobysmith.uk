export interface Env {
  apiUrl: string;
  isDevelopment: boolean;

  contact: Contact;

  recaptcha: {
    clientKey: string;
    secretKey: string;
  };

  email: ContactEmail;

  disqus: {
    shortName: string;
    blogUrl: string;
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

export interface ContactEmail {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
  to: string;
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
  },

  email: {
    host: process.env.EMAIL_HOST ?? "",
    port: parseNumber(process.env.EMAIL_PORT, 465),
    user: process.env.EMAIL_USER ?? "",
    pass: process.env.EMAIL_PASS ?? "",

    to: process.env.EMAIL_TO ?? "",
    from: process.env.EMAIL_FROM ?? ""
  },

  disqus: {
    shortName: process.env.DISQUS_SHORT_NAME ?? "",
    blogUrl: process.env.DISQUS_BLOG_URL ?? ""
  }
});

const parseNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }

  const trimmedInput = value.trim();

  if (trimmedInput === "") {
    return fallback;
  }

  const parsed = Number(trimmedInput);

  if (Number.isNaN(parsed)) {
    return fallback;
  }

  return parsed;
};
