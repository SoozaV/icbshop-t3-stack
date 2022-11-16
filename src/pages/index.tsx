import { type NextPage } from "next";
import Layout from "../components/Layout";
import ProductItem from "../components/ProductItem";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const products = trpc.product.getAllProducts.useQuery();

  return (
    <Layout>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.status &&
          products.data?.map((product) => (
            <ProductItem product={product} key={product.slug} />
          ))}
      </div>
    </Layout>
  );
};

export default Home;
