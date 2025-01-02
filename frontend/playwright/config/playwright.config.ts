import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://localhost:4200', // Adjust for your Angular app
    headless: false,
    screenshot: 'on',
    video: 'retain-on-failure',
  },
});
