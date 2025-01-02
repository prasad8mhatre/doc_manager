import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/login-page';

test.describe('Login Page Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  

  test('document page must be loaded', async ({page}) => {
    await loginPage.fillUsername('prasad2@gmail.com');
    await loginPage.fillPassword('123');
    await loginPage.submit();

    await expect(page).toHaveURL('http://localhost:4200/document-management');

    page.locator("#pageDocTitle")
    
    //click on logout
    const logoutButton = page.locator('#logoutBtn');  // Adjust the selector as per your app
    await logoutButton.click();

    await expect(page).toHaveURL('http://localhost:4200/');

    const loginButton = page.locator('#loginBtn');  // Adjust the selector as per your app
    await loginButton.click();

    await expect(page).toHaveURL('http://localhost:4200/');



  });


  
});
