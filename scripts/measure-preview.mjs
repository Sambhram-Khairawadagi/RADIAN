import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
const origin = process.env.PERFORMANCE_URL || 'http://127.0.0.1:3001';
const browser = await chromium.launch();
const measurements = [];
for (const profile of [
  { name:'Desktop, local production server, no throttling', width:1440,height:960,throttled:false },
  { name:'Phone viewport, 4x CPU slowdown, 1.6 Mbps / 150 ms simulated network', width:390,height:844,throttled:true },
]) {
  const context = await browser.newContext({ viewport:{width:profile.width,height:profile.height} });
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__radianMetrics = { lcp:0,cls:0 };
    new PerformanceObserver(list=>{for(const e of list.getEntries())window.__radianMetrics.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__radianMetrics.cls+=e.value;}).observe({type:'layout-shift',buffered:true});
  });
  const session=await context.newCDPSession(page);
  if(profile.throttled){
    await session.send('Network.enable');
    await session.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1_600_000/8,uploadThroughput:750_000/8});
    await session.send('Emulation.setCPUThrottlingRate',{rate:4});
  }
  const errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(origin,{waitUntil:'load'});
  await page.waitForTimeout(profile.throttled?7000:2000);
  const values=await page.evaluate(()=>({
    ...window.__radianMetrics,
    fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime??null,
    documentMs:performance.getEntriesByType('navigation')[0].responseStart,
    resourceBytes:performance.getEntriesByType('resource').reduce((sum,r)=>sum+r.transferSize,0),
    resources:performance.getEntriesByType('resource').length,
    sequenceFrame:document.querySelector('canvas')?.dataset.frame,
    overflow:document.documentElement.scrollWidth>innerWidth,
  }));
  measurements.push({profile:profile.name,...values,errors});
  await fs.mkdir('docs/previews',{recursive:true});
  await page.screenshot({path:`docs/previews/${profile.throttled?'mobile':'desktop'}-hero.png`});
  if(!profile.throttled){
    await page.getByRole('link',{name:'Explore the building',exact:true}).click();
    await page.getByRole('tab',{name:'3',exact:true}).click();
    await expect(page.getByRole('tab',{name:'3',exact:true})).toHaveAttribute('aria-selected','true');
    await expect(page.getByRole('heading',{name:'Third floor',exact:true})).toHaveCSS('opacity','1');
    await page.screenshot({path:'docs/previews/floor-explorer.png'});
    await page.locator('#interiors').scrollIntoViewIfNeeded();await page.screenshot({path:'docs/previews/interiors.png'});
  }
  await context.close();
}
await browser.close();
const output={note:'Single local production-build samples, not Lighthouse scores, field Core Web Vitals or physical-device measurements. Initial viewport only. Browser cache cold per profile; local server/image cache may be warm.',measurements};
await fs.writeFile('docs/performance-sample.json',JSON.stringify(output,null,2));
console.log(JSON.stringify(output,null,2));
