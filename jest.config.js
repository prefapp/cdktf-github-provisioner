module.exports = {
    rootDir: '.',
    verbose: true,
    projects: [
      {
        preset: 'ts-jest',
        testEnvironment: 'node',
        displayName: 'provisioner',
        setupFilesAfterEnv: ['./setup.js'],
        testMatch: ['<rootDir>/__tests__/**/*.ts'],
      },
    ],
  };
