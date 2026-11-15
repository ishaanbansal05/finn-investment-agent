import {test,expect} from '@playwright/test';
test('brief, evidence trail, saved items, thresholds, and research work on mobile and desktop',async({page})=>{
 const errors:string[]=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await page.waitForResponse(r=>r.url().endsWith('/api/health'));await expect(page.getByRole('heading',{name:'Your portfolio, in perspective.'})).toBeVisible();
 await expect(page.locator('.filing-card').first()).toBeVisible();
 await page.locator('.filing-main').first().click();await expect(page.getByRole('dialog')).toBeVisible();await expect(page.getByRole('link',{name:'Read the filing'})).toHaveAttribute('href',/nseindia/);await page.getByRole('button',{name:'Save for later',exact:true}).click();await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByLabel('Digest time window').selectOption('24');await expect(page.getByRole('heading',{name:'A quiet window.'})).toBeVisible();await page.getByRole('button',{name:'See the past week'}).click();
 await page.getByRole('button',{name:'Follow the evidence'}).click();await expect(page.getByText('Below range · −0.3pp')).toBeVisible();await page.getByRole('button',{name:'Verify the original promise'}).click();await expect(page.getByRole('link',{name:'Open original document'})).toHaveAttribute('href',/q3.*page=7/);await page.getByRole('button',{name:'Close dialog'}).click();
 await page.getByRole('button',{name:'The numbers',exact:true}).click();await expect(page.getByRole('cell',{name:'40,925',exact:true})).toBeVisible();await expect(page.getByText('Not reported in selected tables')).toBeVisible();
 await page.getByRole('button',{name:'Cash quality',exact:true}).click();await expect(page.getByRole('heading',{name:'Excluding tax refunds'})).toBeVisible();
 const mobile=page.viewportSize()!.width<851;await page.locator(mobile?'.mobile-nav':'.sidebar nav').getByRole('button',{name:'Signals',exact:false}).click();await page.getByRole('button',{name:'Tune your signals'}).click();await page.getByLabel('Daily price movement').fill('1');await page.getByRole('button',{name:'Done',exact:false}).click();await expect(page.getByText('±1%',{exact:true})).toBeVisible();
 await page.reload();await page.locator(mobile?'.mobile-nav':'.sidebar nav').getByRole('button',{name:'Signals',exact:false}).click();await expect(page.getByText('±1%',{exact:true})).toBeVisible();
 await page.locator(mobile?'.mobile-nav':'.sidebar nav').getByRole('button',{name:'Portfolio',exact:true}).click();await expect(page.locator('.portfolio-table tbody tr')).toHaveCount(18);
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();expect(errors).toEqual([]);
 await page.screenshot({path:`artifacts/portfolio-${page.viewportSize()!.width}.png`,fullPage:true});
});
