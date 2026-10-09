import { chromium, expect } from '@playwright/test';
import fs from 'node:fs/promises';
const browser = await chromium.launch();
const results = [];
const delayed = process.env.HERO_DELAY !== '0';
for (const mobile of [false, true]) {
  const page = await browser.newPage({ viewport: mobile ? { width:390, height:844 } : { width:1440, height:960 }, deviceScaleFactor: mobile ? 3 : 1 });
  const client = await page.context().newCDPSession(page);
  if (mobile) await client.send('Emulation.setCPUThrottlingRate', { rate:4 });
  if (delayed) await page.route('**/frame-*.webp', async route => {
    await new Promise(resolve => setTimeout(resolve, mobile ? 100 : 40));
    await route.continue();
  });
  await page.goto(process.env.HERO_URL || 'http://127.0.0.1:3000');
  await expect(page.locator('canvas')).toHaveAttribute('data-frame', '0');
  const metrics = await page.evaluate(async ({ count, distance }) => {
    const samples = []; const canvas = document.querySelector('canvas');
    const points = [0, .75, .15, .9, 0];
    for(let phase=0; phase<4; phase++) {
      const start = performance.now(); let previous = start;
      await new Promise(resolve => {
        function step(now) {
          const t = Math.min(1, (now-start)/2000);
          const progress = points[phase] + (points[phase+1]-points[phase])*t;
          scrollTo({ top: progress*distance, behavior:'instant' });
          samples.push({ phase, time:now, raf:now-previous, target: Math.round(progress*(count-1)), frame:Number(canvas.dataset.frame), cache:Number(canvas.dataset.cacheSize) });
          previous=now;
          if(t<1) requestAnimationFrame(step); else resolve();
        }
        requestAnimationFrame(step);
      });
    }
    await new Promise(resolve=>setTimeout(resolve,500));
    return { samples, finalFrame:Number(canvas.dataset.frame), canvasPixels:canvas.width*canvas.height };
  }, { count:mobile?90:180, distance:mobile?844*2.2:960*4 });
  const s=metrics.samples; const percentile=(values,p)=>values.sort((a,b)=>a-b)[Math.floor((values.length-1)*p)];
  let regressions=0, hold=0, longestHold=0;
  s.forEach((v,i)=>{if(!i)return;const prev=s[i-1]; if(v.phase!==prev.phase)return;
    const dir=v.phase%2===0?1:-1;
    if((v.frame-prev.frame)*dir<0)regressions++;
    hold=v.frame===prev.frame?hold+v.raf:0;longestHold=Math.max(longestHold,hold);
  });
  results.push({ profile:(mobile?'phone DPR3 / 4x CPU':'desktop') + (delayed ? ` / added ${mobile?100:40}ms frame latency` : ' / local production network with browser caching'), p95RafMs:percentile(s.map(v=>v.raf),.95), p95FrameLag:percentile(s.map(v=>Math.abs(v.target-v.frame)),.95), wrongDirectionDraws:regressions, longestHoldMs:Math.round(longestHold), maxDecodedFrames:Math.max(...s.map(v=>v.cache)), finalFrame:metrics.finalFrame, canvasPixels:metrics.canvasPixels, frameResponses:await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>r.name.includes('/frame-')).length) });
  await page.close();
}
await browser.close();
await fs.writeFile(`docs/hero-profile-${process.argv[2] || 'latest'}.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
