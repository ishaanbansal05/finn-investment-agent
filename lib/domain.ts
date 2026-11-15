export type Category = 'results' | 'management_change' | 'M&A' | 'fund_raise' | 'litigation' | 'credit_rating' | 'dividend' | 'capex' | 'earnings_call' | 'investor_meetings' | 'routine' | 'other';
export type Company = { symbol: string; name: string; sector: string; weight: number; color: string };
export type Filing = { id: string; symbol: string; title: string; description: string; publishedAt: string; url: string; category: Category; priority: number; reason: string; source: 'NSE' | 'Company IR'; datePrecision?: 'day' | 'second' };
export type Bar = { date: string; close: number; volume: number };
export type Quote = { symbol: string; close: number; changePct: number; volume: number; averageVolume: number; volumeRatio: number; date: string; bars: Bar[]; url: string };
export type Coverage = { symbol: string; prices: 'ok' | 'unavailable'; filings: 'ok' | 'unavailable'; priceError?: string; filingError?: string; count: number };
export type Snapshot = { asOf: string; fetchedAt: string; mode: 'snapshot' | 'live'; companies: Company[]; quotes: Quote[]; filings: Filing[]; coverage: Coverage[] };
export type Rules = { pricePct: number; volumeMultiple: number; categories: Category[] };
export type Alert = { id: string; symbol: string; kind: 'price' | 'volume' | 'filing'; title: string; detail: string; date: string; url: string };
export const DEFAULT_RULES: Rules = { pricePct: 3, volumeMultiple: 2, categories: ['results', 'management_change', 'M&A', 'litigation', 'fund_raise'] };
export const CATEGORY_LABELS: Record<Category, string> = { results: 'Results', management_change: 'Leadership', 'M&A': 'Mergers & acquisitions', fund_raise: 'Capital', litigation: 'Regulatory & legal', credit_rating: 'Credit rating', dividend: 'Dividend', capex: 'Capacity', earnings_call: 'Earnings call', investor_meetings: 'Investor meeting', routine: 'Routine', other: 'Other disclosure' };

export function normalizeSymbol(input: string): string {
  const symbol = input.trim().toUpperCase().replace(/\.NS$/, '');
  if (!/^[A-Z0-9][A-Z0-9&-]{0,24}$/.test(symbol)) throw new Error('Enter a valid NSE symbol, for example INFY or M&M.');
  return symbol;
}

export function classify(title: string, description = ''): { category: Category; priority: number; reason: string } {
  const t = `${title} ${description}`.toLowerCase();
  if (/reference to.*financial results.*suzuki motor/.test(t)) return { category:'other',priority:45,reason:'Parent-company results forwarded by the issuer; not the issuer’s own quarterly result.' };
  // Specific exceptions precede broad matches: a results newspaper ad is not results.
  if (/fraud|forensic|default|insolvency|auditor.{0,25}resign|qualified opinion/.test(t)) return { category: 'litigation', priority: 98, reason: 'Potential governance or solvency event. Read the original filing.' };
  if (/newspaper|advertisement|trading window|compliance certificate|loss of share|duplicate share|dematerial|esop|esos|regulation 74|regulation 39|regulation 57|regulation 7\(/.test(t)) return { category: 'routine', priority: 12, reason: 'Administrative disclosure; kept in the audit trail.' };
  if (/resign|appointment|cessation|change.*(director|management|ceo|cfo)|key managerial/.test(t)) return { category: 'management_change', priority: 85, reason: 'Leadership continuity may affect execution. Role and context need review.' };
  if (/acquisition|merger|demerger|joint venture|amalgamation|disinvestment/.test(t)) return { category: 'M&A', priority: 88, reason: 'Changes the business or capital allocation; terms deserve attention.' };
  if (/litigation|penalt|fine\b|regulatory order|show cause|tax demand|assessment order/.test(t)) return { category: 'litigation', priority: 82, reason: 'Potential financial or regulatory exposure; materiality is not yet quantified.' };
  if (/transcript|audio recording|video recording|earnings call|conference call/.test(t)) return { category: 'earnings_call', priority: /transcript/.test(t) ? 62 : 30, reason: /transcript/.test(t) ? 'Primary evidence for management commitments and analyst questions.' : 'Call logistics or recording; distinct from reported financial results.' };
  if (/schedule.*(analyst|investor)|investor.*meet|analyst.*meet|investor conference/.test(t)) return { category: 'investor_meetings', priority: 20, reason: 'Meeting logistics; no new financial result inferred.' };
  if (/board meeting.*(intimat|notice)|intimation.*board meeting/.test(t)) return { category: 'routine', priority: 22, reason: 'A meeting notice is not a reported result.' };
  if (/financial result|quarterly result|financial statement|earnings release/.test(t)) return { category: 'results', priority: 92, reason: 'New reported numbers can change the investment thesis.' };
  if (/fund rais|preferential|qualified institutional|rights issue|buyback|debenture|commercial paper|allotment.*secur/.test(t)) return { category: 'fund_raise', priority: 72, reason: 'Funding or capital-return decision; dilution and leverage need review.' };
  if (/credit rating|rating.*(assign|reaffirm|upgrade|downgrade)/.test(t)) return { category: 'credit_rating', priority: /downgrade|negative/.test(t) ? 88 : 42, reason: 'Review the rating action and outlook; reaffirmations are lower priority.' };
  if (/dividend|record date/.test(t)) return { category: 'dividend', priority: 48, reason: 'Cash distribution or eligibility date for portfolio holders.' };
  if (/capacity|capex|new plant|commissioning/.test(t)) return { category: 'capex', priority: 70, reason: 'Potential change in capacity, investment needs, and future returns.' };
  return { category: 'other', priority: 45, reason: 'Unclassified disclosure retained for review; not assumed immaterial.' };
}

export function percentChange(current: number | null, previous: number | null): number | null {
  if (current === null || previous === null || !Number.isFinite(current) || !Number.isFinite(previous) || previous <= 0) return null;
  return (current / previous - 1) * 100;
}
export function quoteFromBars(symbol: string, input: Bar[], url: string): Quote | null {
  const bars = [...input].filter(b => Number.isFinite(b.close) && b.close > 0 && Number.isFinite(b.volume) && b.volume >= 0).sort((a,b) => a.date.localeCompare(b.date));
  if (bars.length < 21) return null;
  const last = bars.at(-1)!;
  const previous = bars.at(-2)!;
  // Exactly the preceding 20 completed sessions; current session is excluded.
  const history = bars.slice(-21, -1);
  const averageVolume = history.reduce((sum,b) => sum + b.volume, 0) / history.length;
  return { symbol, close: last.close, date: last.date, volume: last.volume, averageVolume, volumeRatio: averageVolume ? last.volume / averageVolume : 0, changePct: percentChange(last.close,previous.close)!, bars: bars.slice(-31), url };
}
export function uniqueFilings(filings: Filing[]): Filing[] {
  const seen = new Set<string>();
  return filings.filter(f => {
    const key = `${f.symbol}:${f.url.split('?')[0]}`;
    if (seen.has(key)) return false;
    seen.add(key); return true;
  });
}
export function windowFilings(filings: Filing[], asOf: string, hours: number): Filing[] {
  const end = Date.parse(asOf); const start = end - hours * 3600000;
  return filings.filter(f => Date.parse(f.publishedAt) >= start && Date.parse(f.publishedAt) <= end).sort((a,b) => b.priority-a.priority || b.publishedAt.localeCompare(a.publishedAt));
}
export function evaluateAlerts(snapshot: Snapshot, rules: Rules): Alert[] {
  const alerts: Alert[] = [];
  for (const q of snapshot.quotes) {
    if (Math.abs(q.changePct) >= rules.pricePct) alerts.push({ id: `price:${q.symbol}:${q.date}`, symbol: q.symbol, kind: 'price', title: `${q.changePct > 0 ? '+' : ''}${q.changePct.toFixed(2)}% at the close`, detail: `Your threshold: ±${rules.pricePct}%. Close-to-close move; not a live quote.`, date: q.date, url: q.url });
    if (q.volumeRatio >= rules.volumeMultiple) alerts.push({ id: `volume:${q.symbol}:${q.date}`, symbol: q.symbol, kind: 'volume', title: `${q.volumeRatio.toFixed(2)}× normal volume`, detail: `Compared with the previous 20 completed trading sessions. Your threshold: ${rules.volumeMultiple}×.`, date: q.date, url: q.url });
  }
  for (const f of windowFilings(snapshot.filings, snapshot.asOf,24*7)) if (rules.categories.includes(f.category)) alerts.push({ id:`filing:${f.id}`, symbol:f.symbol,kind:'filing',title:f.title,detail:f.reason,date:f.publishedAt,url:f.url });
  return alerts;
}

export function parseNseDate(value: string): string | null {
  const m = value.match(/^(\d{2})-([A-Za-z]{3})-(\d{4})[ T](\d{2}):(\d{2}):(\d{2})$/);
  if (!m) return null;
  const months = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
  const month = months.indexOf(m[2].toLowerCase());
  if (month < 0) return null;
  return new Date(Date.UTC(+m[3],month,+m[1],+m[4],+m[5],+m[6])-330*60000).toISOString();
}
