import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";

export const stateRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const states = await ctx.prisma.state.findMany();
    if (states.length === 0) {
      return await ctx.prisma.state.create({
        data: {
          locked: false,
        },
      });
    }

    return states[0];
  }),
  lock: publicProcedure.mutation(async ({ ctx }) => {
    return await ctx.prisma.state.updateMany({
      data: {
        locked: true,
      },
    });
  }),
  unlock: publicProcedure.mutation(async ({ ctx }) => {
    await ctx.prisma.vote.deleteMany();

    return await ctx.prisma.state.updateMany({
      data: {
        locked: false,
      },
    });
  }),
});
