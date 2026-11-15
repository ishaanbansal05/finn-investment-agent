import companies from '@/data/portfolio.json';
import { refreshPortfolio } from '@/lib/providers';
import { gate } from '@/lib/server-config';
export async function POST(request:Request){
  const blocked=gate(request);if(blocked)return blocked;
  try{const data=await refreshPortfolio(companies);data.filings=data.filings.filter(f=>Date.parse(f.publishedAt)>=Date.parse(data.asOf)-30*86400000);return Response.json(data);}catch{return Response.json({error:'Live refresh failed. The dated snapshot is still available.'},{status:502});}
}
