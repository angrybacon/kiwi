import { type Config } from 'jest';

export default {
  preset: 'ts-jest',
  resetMocks: true,
  testEnvironment: 'node',
} satisfies Config;
