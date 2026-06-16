import { createMiddleware } from "@tanstack/react-start";

export const attachSupabaseAuth = createMiddleware().server(async ({ next }) => {
  // TODO: Implement Supabase auth attachment
  return await next();
});
