interface Env {
  apiUrl: string;
}

export const getEnv = (): Env => ({
  apiUrl: process.env.API_URL ?? ""
});
