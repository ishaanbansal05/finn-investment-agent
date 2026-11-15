import { env } from 'cloudflare:workers';

export function runtimeEnvironment(): Record<string, string | undefined> {
  return env as unknown as Record<string, string | undefined>;
}
