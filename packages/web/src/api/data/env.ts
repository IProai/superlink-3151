/**
 * Runtime-neutral env access. Works on Bun and Node, and keeps the shared API types
 * compiling inside the mobile package (whose ProcessEnv is narrowed).
 */
type ProcLike = { env?: Record<string, string | undefined>; version?: string };
const proc = (globalThis as { process?: ProcLike }).process;

export function env(key: string): string | undefined {
  return proc?.env?.[key];
}

export function runtimeName(): string {
  return "Bun" in globalThis ? "bun" : `node ${proc?.version ?? "?"}`;
}
