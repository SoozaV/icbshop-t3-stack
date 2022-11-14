import Link from "next/link";
import React from "react";

type ProductProps = {
  product: {
    id: string;
    title: string;
    slug: string;
    img: string;
    price: number;
  };
};

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="card">
      <Link href={`/product/${product.slug}`}>
        <img src={product.img} alt={product.title} className="rounded shadow" />
      </Link>
      <div className="flex flex-col items-center justify-center p-5">
        <Link href={`/product/${product.slug}`}>
          <h2 className="text-lg">{product.title}</h2>
        </Link>
        <p className="mb-2">${product.price}</p>
        <button className="primary-button" type="button">
          Añadir
        </button>
      </div>
    </div>
  );
};

export default Product;
