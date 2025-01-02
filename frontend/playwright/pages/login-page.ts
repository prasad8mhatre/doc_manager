import { Page } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async navigate() {
    await this.page.goto('http://localhost:4200/');
  }

  async fillUsername(username: string) {
    await this.page.fill('input[name="username"]', username);
  }

  async fillPassword(password: string) {
    await this.page.fill('input[name="password"]', password);
  }

  async submit() {
    await this.page.click('button[type="submit"]');
  }

  async getValidationError(selector: string) {
    return this.page.locator(selector).textContent();
  }
}
