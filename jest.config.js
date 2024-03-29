// eslint-disable-next-line @typescript-eslint/no-var-requires
const nextJest = require("next/jest");

// cspell:words Serializers

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./"
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "<rootDir>/"],
  testEnvironment: "jest-environment-jsdom",
  testPathIgnorePatterns: ["/node_modules/", "/e2e/"],
  collectCoverageFrom: ["<rootDir>/src/**/*.{ts,tsx}"],
  snapshotSerializers: ["jest-serializer-html"]
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
