export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@angular/core$': '<rootDir>/src/__mocks__/@angular/core.ts',
  },
};
