import {chromium} from '@playwright/test';
const browser=await chromium.launch();const results=[];
for(const view of [{width:1440,height:900},{width:390,height:667},{width:844,height:390}]){
 const page=await browser.newPage({viewport:view});const errors=[];page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto('http://127.0.0.1:3000/#contact');await page.waitForTimeout(1200);
 const deep=await page.locator('#contact').evaluate(el=>({y:el.getBoundingClientRect().top,scroll:scrollY,header:document.querySelector('header').getBoundingClientRect().bottom}));
 await page.getByRole('link',{name:'Back to top',exact:true}).click();await page.waitForTimeout(2500);
 const top=await page.evaluate(()=>({scroll:scrollY,hero:document.querySelector('.hero').getBoundingClientRect().top,media:document.querySelector('.hero-media').getBoundingClientRect().toJSON(),viewport:innerHeight,pinned:!!document.querySelector('.pin-spacer')}));
 results.push({view,deep,top,errors});await page.close();
}
await browser.close();console.log(JSON.stringify(results,null,2));
