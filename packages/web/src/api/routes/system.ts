import { base } from "../__core/app";
import { rawQuery } from "../data/mariadb";
import { runtimeName } from "../data/env";

export async function dbHealth() {
  const started = Date.now();
  try {
    const rows = await rawQuery<{ v: string }>("select version() as v");
    return { ok: true as const, engine: String(rows[0]?.v ?? ""), ms: Date.now() - started };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : String(e), ms: Date.now() - started };
  }
}

export const system = {
  health: base.handler(async () => ({ app: "ok" as const, runtime: runtimeName(), db: await dbHealth() })),
};
