module.exports = {
    preset: "ts-jest",
    clearMocks: true,
    collectCoverage: true,
    coverageReporters: ["text"],
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: ["/node_modules/"],
    moduleDirectories: ["node_modules"],
    testRegex: ".*\\.spec\\.ts$",
    moduleFileExtensions: ["ts", "js"],
    testEnvironment: "node",
    transformIgnorePatterns: ["/node_modules/"]
};
