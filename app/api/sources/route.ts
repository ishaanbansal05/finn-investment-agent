import { discoverDocuments } from '@/lib/research';
export async function GET(request:Request){
  try{return Response.json({sources:await discoverDocuments(new URL(request.url).searchParams.get('symbol')||'')});}
  catch(e){return Response.json({error:e instanceof Error?e.message:'Source discovery failed.'},{status:422});}
}
