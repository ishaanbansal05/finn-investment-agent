import {chromium} from '@playwright/test';
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1000}});
page.on('pageerror',e=>console.log('PAGE ERROR',e.message));page.on('console',m=>{if(m.type()==='error')console.log('CONSOLE',m.text().slice(0,1500));});
await page.goto('http://127.0.0.1:5173/');await page.waitForTimeout(5000);await page.screenshot({path:'artifacts/brief-desktop.png',fullPage:true});await page.locator('.filing-main').first().click();await page.waitForTimeout(1500);console.log('Dialogs',await page.locator('dialog').count());console.log((await page.locator('body').innerText()).slice(-1800));await browser.close();
