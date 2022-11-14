import { Product } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default function ProductItem({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`}>
      <div className="card overflow-hidden rounded bg-slate-300 shadow-md duration-500 motion-safe:hover:scale-105">
          <img
            src={product.imgUrl}
            alt={product.title}
          />
        <div className="flex flex-col items-center justify-center p-5">
          <h2 className="text-lg">{product.title}</h2>
          <div>
            <p>
              Precio: <span>${product.price}</span>
            </p>
            <p>
              Stock: <span>{product.stock}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
