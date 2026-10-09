import {chromium} from '@playwright/test';
import fs from 'node:fs/promises';
import sharp from 'sharp';
const out='docs/section-audit';await fs.mkdir(out,{recursive:true});
const browser=await chromium.launch();const report=[];
const sections=['hero','introduction','architecture','explorer','specifications','interiors','amenities','location','developer','contact','footer'];
for(const width of [1440,768,390,360,844]){
 const page=await browser.newPage({viewport:{width,height:width===844?390:900},reducedMotion:'reduce'});
 const errors=[],warnings=[],failed=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});page.on('response',r=>{if(r.status()>=400)failed.push({url:r.url(),status:r.status()});});
 await page.goto('http://127.0.0.1:3000');const records=[];
 for(const name of sections){const section=page.locator('.'+name).first();await section.scrollIntoViewIfNeeded();
  await section.locator('img').evaluateAll(images=>Promise.all(images.map(img=>img.decode().catch(()=>{}))));
  const data=await section.evaluate(el=>({height:el.getBoundingClientRect().height,overflow:el.scrollWidth>el.clientWidth+1,badImages:[...el.querySelectorAll('img')].filter(img=>!img.naturalWidth).map(img=>img.src),escaped:[...el.querySelectorAll('h1,h2,h3,p,button,input,a,select')].filter(n=>{if(n.closest('.interior-grid')) return false; const r=n.getBoundingClientRect();return r.width&&r.right>innerWidth+1;}).map(n=>({tag:n.tagName,text:n.textContent?.slice(0,60),right:n.getBoundingClientRect().right}))}));
  records.push({name,...data});
  if([1440,768,390].includes(width))await section.screenshot({path:`${out}/${width}-${name}.png`,style:'.header, .skip-link, .mobile-enquiry, nextjs-portal { visibility: hidden !important; }'});
 }
 report.push({width,height:width===844?390:900,errors,warnings:[...new Set(warnings)],failed,sections:records,pageOverflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)});await page.close();
}
await browser.close();
for(const width of [1440,768,390]){
 for(let group=0;group<3;group++){
  const names=sections.slice(group*4,group*4+4);const tiles=[];let y=0;
  for(const name of names){const buffer=await sharp(`${out}/${width}-${name}.png`).resize({width:width===1440?720:390}).png().toBuffer();const meta=await sharp(buffer).metadata();tiles.push({input:buffer,left:0,top:y});y+=meta.height+15;}
  await sharp({create:{width:width===1440?720:390,height:y,channels:3,background:'#999'}}).composite(tiles).png().toFile(`${out}/${width}-sheet-${group}.png`);
 }
}
await fs.writeFile(`${out}/report.json`,JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
