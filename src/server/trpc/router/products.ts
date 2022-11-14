import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const productRouter = router({
  getAllProducts: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.product.findMany();
  }),
  getProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.product.findUnique({
        where: {
          id: input.productId,
        },
      });
    }),
  addProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(({ ctx, input }) => {}),
  //editProduct: "",
  deleteProduct: publicProcedure
    .input(z.object({ productId: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.product.delete({
        where: {
          id: input.productId,
        },
      });
    }),
});
