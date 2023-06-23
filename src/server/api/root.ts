import { voteRouter } from "src/server/api/routers/vote";
import { createTRPCRouter } from "src/server/api/trpc";
import { stateRouter } from "./routers/state";
import { voterRouter } from "./routers/voter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  state: stateRouter,
  vote: voteRouter,
  voter: voterRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
