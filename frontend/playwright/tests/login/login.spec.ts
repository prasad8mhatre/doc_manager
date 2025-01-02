import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should show validation error for empty inputs', async () => {
    await loginPage.submit();
    const usernameError = await loginPage.getValidationError('#errorMsg');

    expect(usernameError).toBe('Login failed!');
  });

  test('should log in successfully with valid credentials', async ({page}) => {
    await loginPage.fillUsername('prasad2@gmail.com');
    await loginPage.fillPassword('123');
    await loginPage.submit();

    await expect(page).toHaveURL('http://localhost:4200/document-management');

    //click on logout
    const logoutButton = page.locator('#logoutBtn');  // Adjust the selector as per your app
    await logoutButton.click();

    await expect(page).toHaveURL('http://localhost:4200/');

    const loginButton = page.locator('#loginBtn');  // Adjust the selector as per your app
    await loginButton.click();

    await expect(page).toHaveURL('http://localhost:4200/');



  });


  test('should log in successfully with valid credentials with admin', async ({page}) => {
    await expect(page).toHaveURL('http://localhost:4200/');

    await loginPage.fillUsername('prasad@gmail.com');
    await loginPage.fillPassword('123');
    await loginPage.submit();

    await expect(page).toHaveURL('http://localhost:4200/user-management');
  });
});
