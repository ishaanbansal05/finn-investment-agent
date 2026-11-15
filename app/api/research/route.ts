import { researchCompany } from '@/lib/research';
import { aiConfig,gate } from '@/lib/server-config';
export async function POST(request:Request){
  const blocked=gate(request);if(blocked)return blocked;
  if(Number(request.headers.get('content-length'))>5000)return Response.json({error:'Request too large.'},{status:413});
  try{
    const text=await request.text();if(text.length>5000)return Response.json({error:'Request too large.'},{status:413});
    const body=JSON.parse(text);
    if(typeof body.symbol!=='string'||typeof body.question!=='string'||body.question.length<8||body.question.length>600)return Response.json({error:'Enter a ticker and a question between 8 and 600 characters.'},{status:400});
    return Response.json(await researchCompany(body.symbol,body.question,aiConfig()));
  }catch(e){return Response.json({error:e instanceof Error?e.message:'Research is temporarily unavailable.'},{status:422});}
}
