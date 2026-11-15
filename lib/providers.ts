import { normalizeSymbol, parseNseDate, classify, quoteFromBars, uniqueFilings, type Company, type Filing, type Quote, type Snapshot } from './domain.ts';

const UA = 'Mozilla/5.0 FINN-ResearchPrototype/1.0';
const cache = new Map<string, { expires: number; value: unknown }>();
export async function cached<T>(key: string, ttl: number, work: () => Promise<T>): Promise<T> {
  const existing = cache.get(key);
  if (existing && existing.expires > Date.now()) return existing.value as T;
  const value = await work();
  if (cache.size > 200) cache.delete(cache.keys().next().value!);
  cache.set(key, { expires: Date.now()+ttl, value });
  return value;
}
export async function fetchText(url: string, timeout = 12000): Promise<string> {
  const response = await fetch(url, { headers: { 'User-Agent': UA, Accept: 'application/json,text/html,*/*' }, signal: AbortSignal.timeout(timeout), redirect: 'manual' });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}.`);
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Empty source response.');
  let length=0; const chunks: Uint8Array[]=[];
  while (true) { const {done,value}=await reader.read(); if(done) break; length+=value.length; if(length>5000000) { await reader.cancel(); throw new Error('Source exceeds 5 MB limit.'); } chunks.push(value); }
  const bytes=new Uint8Array(length);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}
  return new TextDecoder().decode(bytes);
}
export async function getQuote(input: string): Promise<Quote> {
  const symbol = normalizeSymbol(input);
  return cached(`quote:${symbol}`, 15*60000, async () => {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}.NS?range=3mo&interval=1d`;
    const data = JSON.parse(await fetchText(url));
    const result = data.chart?.result?.[0];
    if (!result?.timestamp) throw new Error('No EOD history available for this NSE symbol.');
    const q = result.indicators.quote[0];
    const now = new Date();
    const istDay = new Intl.DateTimeFormat('en-CA', {timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
    const istHour = Number(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Kolkata',hour:'numeric',hour12:false}).format(now));
    const bars = result.timestamp.map((ts: number,i: number) => ({date:new Date(ts*1000).toISOString().slice(0,10),close:q.close[i],volume:q.volume[i]})).filter((b: {date:string;close:unknown;volume:unknown}) => b.close != null && b.volume != null && (b.date < istDay || istHour >= 17));
    const quote = quoteFromBars(symbol,bars,`https://finance.yahoo.com/quote/${encodeURIComponent(symbol)}.NS/history/`);
    if (!quote) throw new Error('Fewer than 21 valid completed sessions; volume comparison unavailable.');
    return quote;
  });
}
export async function getFilings(input: string): Promise<Filing[]> {
  const symbol = normalizeSymbol(input);
  return cached(`filings:${symbol}`, 5*60000, async () => {
    const data = JSON.parse(await fetchText(`https://www.nseindia.in/api/corporate-announcements?index=equities&symbol=${encodeURIComponent(symbol)}`));
    if (!Array.isArray(data)) throw new Error('Exchange returned an unexpected response.');
    return uniqueFilings(data.slice(0,150).flatMap((row: Record<string,string>,index:number) => {
      const publishedAt = parseNseDate(row.an_dt || row.sort_date || '');
      const url = row.attchmntFile;
      if (!publishedAt || !url || !/^https:\/\/(nsearchives\.nseindia\.(com|in)|archives\.nseindia\.com)\//.test(url)) return [];
      const title = row.desc || 'Exchange announcement';
      const description = row.attchmntText || row.sm_name || '';
      return [{ id: `${symbol}-${row.seq_id || `${publishedAt}-${index}`}`,symbol,title,description,publishedAt,url,...classify(title,description),source:'NSE' as const,datePrecision:'second' as const }];
    }));
  });
}
export async function refreshPortfolio(companies: Company[]): Promise<Snapshot> {
  const quotes: Quote[]=[];const filings: Filing[]=[];const coverage: Snapshot['coverage']=[];
  // Bounded concurrency limits bursts against the exchanges.
  for(let start=0;start<companies.length;start+=4) {
    await Promise.all(companies.slice(start,start+4).map(async company => {
      const [q,f] = await Promise.allSettled([getQuote(company.symbol),getFilings(company.symbol)]);
      if(q.status==='fulfilled') quotes.push(q.value);
      if(f.status==='fulfilled') filings.push(...f.value);
      coverage.push({symbol:company.symbol,prices:q.status==='fulfilled'?'ok':'unavailable',filings:f.status==='fulfilled'?'ok':'unavailable',count:f.status==='fulfilled'?f.value.length:0,...(q.status==='rejected'?{priceError:q.reason.message}:{}),...(f.status==='rejected'?{filingError:f.reason.message}:{})});
    }));
  }
  const now=new Date().toISOString();
  return {asOf:now,fetchedAt:now,mode:'live',companies,quotes,filings:uniqueFilings(filings),coverage};
}

