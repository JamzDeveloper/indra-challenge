module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  moduleFileExtensions: ["ts", "js", "json"],
  roots: ["<rootDir>/test"],
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1"
  }
};
