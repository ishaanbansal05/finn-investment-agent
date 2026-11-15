// Next.js/Vercel reads runtime secrets from the server process only.
// The Cloudflare build aliases this module to runtime-env.cloudflare.ts.
export function runtimeEnvironment(): Record<string, string | undefined> {
  return process.env;
}
