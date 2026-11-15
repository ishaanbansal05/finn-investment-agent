import snapshot from '@/data/snapshot.json';
export async function GET(){return Response.json(snapshot,{headers:{'Cache-Control':'public, max-age=300'}});}
