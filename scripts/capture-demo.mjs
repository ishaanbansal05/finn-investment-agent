import {chromium} from '@playwright/test';
import {mkdir} from 'node:fs/promises';
await mkdir('docs/screenshots',{recursive:true});
const browser=await chromium.launch();
for(const width of [390,1440]){
 const page=await browser.newPage({viewport:{width,height:width===390?844:1000},deviceScaleFactor:1});
 const ready=page.waitForResponse(r=>r.url().endsWith('/api/health'));await page.goto('http://127.0.0.1:5173/');await ready;
 await page.screenshot({path:`docs/screenshots/brief-${width}.png`,fullPage:false});
 await page.getByRole('button',{name:'Follow the evidence',exact:true}).click();await page.evaluate(()=>window.scrollTo(0,0));
 await page.screenshot({path:`docs/screenshots/promise-ledger-${width}.png`,fullPage:false});
 await page.close();
}
await browser.close();console.log('Captured phone and desktop brief and promise ledger.');
