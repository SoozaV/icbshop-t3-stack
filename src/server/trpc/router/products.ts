import { z } from "zod";

import { router, publicProcedure, trpcMiddleware } from "../trpc";

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
        imgUrl: z.any(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      console.log("imgUrl formData: ", input.imgUrl); // I just receive an empty object

      const imageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/dnovht5lf/image/upload",
        {
          method: "POST",
          body: input.imgUrl,
        }
      ).then((res) => res.json());

      console.log("IMG: ", imageResponse);

      return ctx.prisma.product.create({
        data: {
          title: input.title,
          description: input.description,
          slug: slugify(input.title),
          stock: input.stock,
          price: input.price,
          imgUrl: imageResponse.url,
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

const slugify = (
  str: string // https://www.30secondsofcode.org/js/s/slugify
) =>
  str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
