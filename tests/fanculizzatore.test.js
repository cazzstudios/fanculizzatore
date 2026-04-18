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
    if (baseUrl.startsWith('file://')) {
      test.skip();
      return;
    }
    
    await page.goto(baseUrl);
    
    await page.waitForSelector('#download-list ul', { timeout: 10000 });
    
    const versionSpan = page.locator('#download-version');
    await expect(versionSpan).toHaveText('v2.0.0');
    
    await expect(page.locator('a[href="downloads/app-release.apk"]')).toBeVisible();
    await expect(page.locator('a[href="downloads/fanculizzatore-2.0.0-1.x86_64.rpm"]')).toBeVisible();
    await expect(page.locator('a[href="downloads/fanculizzatore-2.0.0-installer.exe"]')).toBeVisible();
    await expect(page.locator('a[href="downloads/fanculizzatore_2.0.0_amd64.deb"]')).toBeVisible();
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