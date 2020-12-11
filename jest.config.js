module.exports = {
    testEnvironment: "jest-environment-jsdom-sixteen",
    testURL: "http://localhost",
    moduleNameMapper: {
      "@config": "<rootDir>/testing/config/test",
      "@src/(.*)$": "<rootDir>/src/$1",
      "@testing/(.*)$": "<rootDir>/testing/$1"
    },
    transform: {
      ".(ts|tsx)": "ts-jest"
    },
    testRegex: "(testing/tests/.*|\\.(test|spec))\\.(ts|tsx)$",
    moduleFileExtensions: [
      "ts",
      "tsx",
      "js"
    ],
    coverageDirectory: "./testing/reports",
    coveragePathIgnorePatterns: [
      "/node_modules/",
      "/testing/",
      "/wwwroot/"
    ],
    coverageReporters: [
      "json",
      "text",
      "text-summary"
    ],
    setupFilesAfterEnv: [
      "<rootDir>/testing/post-env-setup.ts"
    ]
  }