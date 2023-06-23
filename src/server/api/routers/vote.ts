import { createTRPCRouter, publicProcedure } from "src/server/api/trpc";
import { z } from "zod";

export const voteRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.vote.findMany();
  }),
  post: publicProcedure
    .input(z.object({ voterId: z.number(), id: z.number() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.vote.upsert({
        where: { voterId: input.voterId },
        create: {
          id: input.id,
          voter: {
            connect: {
              id: input.voterId,
            },
          },
        },
        update: {
          id: input.id,
        },
      });
    }),
});
