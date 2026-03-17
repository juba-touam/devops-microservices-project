export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  moduleNameMapper: {
    '^@angular/core$': '<rootDir>/src/__mocks__/@angular/core.ts',
    '^@angular/common$': '<rootDir>/src/__mocks__/@angular/common.ts',
    '^@angular/common/http$': '<rootDir>/src/__mocks__/@angular/common-http.ts',
    '^@angular/router$': '<rootDir>/src/__mocks__/@angular/router.ts',
  },
  collectCoverage: true,
  coverageReporters: ['lcov', 'text'],
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
  ],
};
