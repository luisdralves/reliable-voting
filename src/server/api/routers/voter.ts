import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";

export const voterRouter = createTRPCRouter({
  get: publicProcedure
    .input(z.object({ id: z.number().optional() }))
    .query(({ ctx, input: { id } }) => {
      if (id === undefined) {
        return;
      }

      return ctx.prisma.voter.upsert({
        where: { id },
        update: { id },
        create: { id },
      });
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.voter.findMany();
  }),
  getLowestAvailableId: publicProcedure.query(async ({ ctx }) => {
    const getLowestAvailableId = (ids: number[]) => {
      let lowestAvailableId = 0;

      ids.forEach((id) => {
        if (id <= lowestAvailableId) {
          lowestAvailableId = id + 1;
        }
      });

      return lowestAvailableId;
    };

    const voters = await ctx.prisma.voter.findMany({
      orderBy: {
        id: "asc",
      },
    });

    return getLowestAvailableId(voters.map(({ id }) => id));
  }),
});
