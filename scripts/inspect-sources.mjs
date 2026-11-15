const html = await (await fetch('https://www.screener.in/company/INFY/consolidated/')).text();
const at=html.indexOf('id="documents"'); console.log(html.slice(at,at+12000));
