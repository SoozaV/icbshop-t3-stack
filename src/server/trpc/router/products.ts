import { Product } from "@prisma/client";
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
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        stock: z.number(),
        price: z.number(),
        imgUrl: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const slugify = (
        str: string // https://www.30secondsofcode.org/js/s/slugify
      ) =>
        str
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/[\s_-]+/g, "-")
          .replace(/^-+|-+$/g, "");

      const slug = await ctx.prisma.product
        .findUnique({
          where: {
            slug: slugify(input.title),
          },
        })
        .then((res) => res?.slug);

      console.log("Slug: ", slug);

      return ctx.prisma.product.create({
        data: {
          title: input.title,
          description: input.description,
          slug: slugify(input.title),
          stock: input.stock,
          price: input.price,
          imgUrl: input.imgUrl,
        },
      });
    }),
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
