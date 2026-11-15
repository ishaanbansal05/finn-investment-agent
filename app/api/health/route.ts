import { aiConfig } from '@/lib/server-config';
export async function GET(){return Response.json({status:'ok',aiConfigured:Boolean(aiConfig().key),version:'1.0.0'});}
