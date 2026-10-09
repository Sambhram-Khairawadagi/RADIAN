import { test, expect } from '@playwright/test';

test('gallery supports buttons, keyboard navigation and complete image loading', async ({ page }) => {
 await page.emulateMedia({reducedMotion:'reduce'});
 await page.goto('/');
 const gallery=page.getByRole('region',{name:'Interior image gallery'});
 await gallery.scrollIntoViewIfNeeded();
 await expect(page.getByRole('button',{name:'Previous interior'})).toBeDisabled();
 await page.getByRole('button',{name:'Next interior'}).click();
 await expect(page.locator('.gallery-buttons > span')).toHaveText('02 / 03');
 await gallery.focus();await page.keyboard.press('ArrowRight');
 await expect(page.locator('.gallery-buttons > span')).toHaveText('03 / 03');
 await expect(page.getByRole('button',{name:'Next interior'})).toBeDisabled();
 await gallery.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(img=>(img as HTMLImageElement).decode())));
 await page.getByRole('button',{name:'Previous interior'}).click();
 await expect(page.locator('.gallery-buttons > span')).toHaveText('02 / 03');
});

test('floor selection updates the image label and the enquiry context', async ({ page }) => {
 await page.goto('/');
 await page.getByRole('tab',{name:'3',exact:true}).click();
 await expect(page.locator('.explorer-image-label strong')).toHaveText('Third floor');
 await page.getByRole('link',{name:'Enquire about this floor'}).click();
 await expect(page.locator('.enquiry-form-heading')).toContainText('Your enquiry: Third floor');
 await expect(page.getByLabel('Interested floor')).toHaveValue('3');
});

test('mobile enquiry control appears after the hero and stays out of the form', async ({ page }) => {
 await page.setViewportSize({width:390,height:844});
 await page.goto('/');
 const bar=page.getByRole('complementary',{name:'Quick project enquiry'});
 await expect(bar).toBeHidden();
 await page.locator('#specifications').scrollIntoViewIfNeeded();
 await expect(bar).toBeVisible();
 await bar.getByRole('link',{name:'Enquire now'}).click();
 await expect(bar).toBeHidden();
 await expect(page.getByRole('form',{name:'Project enquiry'})).toBeVisible();
});
