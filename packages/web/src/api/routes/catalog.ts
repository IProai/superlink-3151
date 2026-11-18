import { z } from "zod";
import { ORPCError } from "@orpc/server";
import { base } from "../__core/app";
import { featuredProducts, listCategories, searchProducts } from "../data/catalog-repo";

const guard = async <T>(fn: () => Promise<T>) => {
  try {
    return await fn();
  } catch (e) {
    console.error("[catalog]", e);
    throw new ORPCError("SERVICE_UNAVAILABLE", { message: "Catalog database unavailable" });
  }
};

export const catalog = {
  categories: base.handler(() => guard(listCategories)),
  featured: base
    .input(z.object({ limit: z.number().int().min(1).max(24).default(8) }).default({ limit: 8 }))
    .handler(({ input }) => guard(() => featuredProducts(input.limit))),
  search: base
    .input(z.object({ q: z.string().max(120), limit: z.number().int().min(1).max(50).default(8) }))
    .handler(({ input }) => guard(() => searchProducts(input.q, input.limit))),
};
