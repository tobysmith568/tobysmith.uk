interface Env {
  apiUrl: string;
  isDevelopment: boolean;
}

export const getEnv = (): Env => ({
  apiUrl: process.env.API_URL ?? "",
  isDevelopment: process.env.NODE_ENV === "development"
});
