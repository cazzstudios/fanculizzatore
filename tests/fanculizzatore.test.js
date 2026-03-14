const { test, expect } = require('@playwright/test');

const baseUrl = process.env.DEPLOYED_URL 
  ? process.env.DEPLOYED_URL 
  : 'file://' + process.cwd() + '/index.html';

test.describe('Fanculizzatore Landing Page', () => {
  test('page loads successfully', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page).toHaveTitle(/Fanculizzatore/);
  });

  test('contains Italian content', async ({ page }) => {
    await page.goto(baseUrl);
    await expect(page.locator('text=Scegli quando e quanto insultare')).toBeVisible();
    await expect(page.locator('text=Fanculizzatore è un\'app')).toBeVisible();
  });

  test('displays all 4 screenshots', async ({ page }) => {
    await page.goto(baseUrl);
    const screenshots = [
      'assets/contactview.png',
      'assets/mainview.png',
      'assets/sent.png',
      'assets/settings.png'
    ];
    
    for (const screenshot of screenshots) {
      await expect(page.locator(`img[src="${screenshot}"]`)).toBeVisible();
    }
  });

  test('carousel navigation works', async ({ page }) => {
    await page.goto(baseUrl);
    
    await expect(page.locator('img[src="assets/contactview.png"]')).toBeVisible();
    
    await page.click('.carousel-button.next');
    
    await expect(page.locator('img[src="assets/mainview.png"]')).toBeVisible();
    
    await page.click('.carousel-button.next');
    
    await expect(page.locator('img[src="assets/sent.png"]')).toBeVisible();
  });

  test('download links exist', async ({ page }) => {
    await page.goto(baseUrl);
    
    const linuxLink = page.locator('a[href*="fanculizzatore"]:not([href*="deb"])');
    const debLink = page.locator('a[href*="fanculizzatore_1.0.0_amd64.deb"]');
    
    await expect(linuxLink).toHaveAttribute('href', /github\.com\/fanculizzatore\/fanculizzatore\/releases\/download\/v1\.0\.0\/fanculizzatore/);
    await expect(debLink).toHaveAttribute('href', /github\.com\/fanculizzatore\/fanculizzatore\/releases\/download\/v1\.0\.0\/fanculizzatore_1\.0\.0_amd64\.deb/);
  });

  test('page is responsive on mobile', async ({ page }) => {
    await page.goto(baseUrl);
    
    await page.setViewportSize({ width: 375, height: 667 });
    
    const container = page.locator('.container');
    await expect(container).toBeVisible();
    
    await expect(page.locator('.carousel-button')).toBeVisible();
  });

  test('deployed URL returns 200 status', async ({ page }) => {
    if (!process.env.DEPLOYED_URL) {
      test.skip();
      return;
    }
    
    const response = await page.goto(process.env.DEPLOYED_URL);
    expect(response.status()).toBe(200);
  });
});