import { test, expect } from '@playwright/test';
for (const viewport of [{width:320,height:568},{width:375,height:667},{width:430,height:932},{width:768,height:1024},{width:1024,height:768}]) {
 test(`touch animation and every section at ${viewport.width}x${viewport.height}`, async ({ browser }) => {
  const context=await browser.newContext({viewport,isMobile:true,hasTouch:true,deviceScaleFactor:2});
  const page=await context.newPage();const errors:string[]=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:3000/');
  const canvas=page.getByTestId('sequence-canvas');
  await expect(canvas).toHaveAttribute('data-frame','0');
  const start=viewport.width<=760?await page.locator('.hero-media').evaluate(el=>el.getBoundingClientRect().top+scrollY-82):0;
  const distance=viewport.height*(viewport.width<=760?2.2:4);
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+distance*.65);
  await expect.poll(async()=>Number(await canvas.getAttribute('data-frame'))).toBeGreaterThan(viewport.width<=760?45:90);
  await expect(canvas).toBeInViewport();
  if(viewport.width<=760) expect(await page.locator('#overview').evaluate(el=>el.getBoundingClientRect().top)).toBeGreaterThan(viewport.height);
  await page.screenshot({path:`docs/previews/touch-animation-${viewport.width}.png`});
  await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),start+distance*.1);
  await expect.poll(async()=>Number(await canvas.getAttribute('data-frame'))).toBeLessThan(viewport.width<=760?15:25);
  for(const section of await page.locator('main section, footer').all()) {
   await section.evaluate(el=>el.scrollIntoView({behavior:'instant'}));
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  }
  expect(errors).toEqual([]);
  await context.close();
 });
}
