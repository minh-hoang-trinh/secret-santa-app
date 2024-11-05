export default {
  displayName: 'api-e2e',
  preset: '../../jest.preset.js',
  testMatch: ['**/*.e2e-spec.ts'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
};
