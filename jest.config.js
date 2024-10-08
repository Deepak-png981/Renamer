module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.spec.ts'],
    collectCoverageFrom: [
      '<rootDir>/src/**/*.ts',
      '!<rootDir>/src/__tests__/**/*.ts',
      '!<rootDir>/src/types/**/*.ts',
      '!<rootDir>/src/renamer.ts',
    ],
    transform: {
      '^.+\\.[tj]sx?$': [
        'ts-jest',
        {
          diagnostics: false,
        },
      ],
    },
  };
  