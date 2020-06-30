module.exports = {
  "testTimeout": 30 * 1000,
  "transform": {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  "collectCoverageFrom": [
    "src/**/*.js",
    "!**/node_modules/**"
  ],
  "coveragePathIgnorePatterns": [
    "node_modules/",
    "test/",
    "lib/"
  ],
  "testEnvironment": "node",
  "testRegex": "/test/index.js$"
}