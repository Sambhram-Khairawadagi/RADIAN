import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const base = process.env.AUDIT_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch();
const results = [];
for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }, { width: 844, height: 390 }]) {
  const page = await browser.newPage({ viewport });
  const errors = [], failed = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  page.on('response', response => { if (response.status() >= 400) failed.push(response.url()); });
  await page.goto(`${base}/#contact`);
  await expect.poll(() => page.locator('#contact').evaluate(el => Math.round(el.getBoundingClientRect().top))).toBe(viewport.width <= 760 ? 92 : 110);
  await page.getByRole('link', { name: 'Back to top', exact: true }).click();
  await expect.poll(() => page.evaluate(() => scrollY)).toBe(0);
  if (viewport.height >= 760) await expect(page.getByTestId('sequence-canvas')).toHaveAttribute('data-frame', '0');
  await page.screenshot({ path: `docs/section-audit/production-${viewport.width}-hero.png` });
  const sections = page.locator('main > section, footer');
  for (const section of await sections.all()) {
    await section.evaluate(el => el.scrollIntoView({ behavior: 'instant', block: 'start' }));
    await section.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
  }
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  expect(errors).toEqual([]);
  expect(failed).toEqual([]);
  expect(overflow).toBe(false);
  results.push({ viewport, errors, failed, overflow, navigation: 'passed' });
  await page.close();
}
const files = await fs.readdir('public/media', { recursive: true });
const media = [];
for (const file of files) {
  if ((await fs.stat(`public/media/${file}`)).isFile()) media.push(file);
}
const missing = [];
for (let index = 0; index < media.length; index += 10) {
  await Promise.all(media.slice(index, index + 10).map(async file => {
    const response = await fetch(`${base}/media/${file.replaceAll('\\', '/')}`, { method: 'HEAD' });
    if (response.status !== 200) missing.push({ file, status: response.status });
  }));
}
expect(missing).toEqual([]);
await browser.close();
const report = { base, viewports: results, mediaFilesChecked: media.length, missing };
await fs.writeFile('docs/section-audit/production-report.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
