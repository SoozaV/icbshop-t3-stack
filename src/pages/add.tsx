import { ChangeEvent, FormEvent, useState } from "react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";

type ProductData = {
  title: string;
  description: string;
  stock: number;
  price: number;
  imgUrl: any;
};

export default function AddProduct() {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [productData, setProductData] = useState<ProductData>({
    title: "",
    description: "",
    stock: 0,
    price: 0,
    imgUrl: "",
  });

  const productEndpoint = trpc.product.addProduct.useMutation();

  const handleOnChange = (changeEvent: ChangeEvent) => {
    changeEvent.preventDefault();
    // Generando vista previa de la imagen
    const reader = new FileReader();
    reader.onload = (onLoadEvent) =>
      onLoadEvent.target ? setImageSrc(onLoadEvent?.target?.result) : null;

    const inputElement = changeEvent.target as HTMLFormElement;
    if (changeEvent.target) reader.readAsDataURL(inputElement.files[0]);

    // Agregando la imagen al productData.formData
    const form = changeEvent.currentTarget as HTMLFormElement;

    const formData = new FormData();
    formData.append("file", form.files[0]);
    formData.append("upload_preset", "icb-shop");

    setProductData({
      ...productData,
      imgUrl: formData,
    });
  };

  const addProduct = ({ e, productData, }: { e: FormEvent; productData: ProductData; }) => {
    e.preventDefault();
    console.log("FormData BEFORE sending: ", productData);
    console.log("Testing FormData: ", productData.imgUrl.get("file"));
    productEndpoint.mutate({
      ...productData,
    });
  };

  return (
    <Layout>
      <form
        className="container mx-auto flex max-w-2xl flex-col"
        onSubmit={(e) => addProduct({ e, productData })}
      >
        <input
          onChange={(e) =>
            setProductData({ ...productData, title: e.target.value })
          }
          type="text"
          className="mb-2 rounded border-2 p-3 outline-none"
          value={productData.title}
          placeholder="Título del producto"
        />
        <textarea
          onChange={(e) =>
            setProductData({ ...productData, description: e.target.value })
          }
          value={productData.description}
          placeholder="Descripción del producto"
          className="mb-2 rounded border-2 p-3 outline-none"
        />
        <div className="flex">
          <div className="mr-1 flex w-2/4 flex-col">
            <label htmlFor="price"> Precio del producto:</label>
            <input
              id="price"
              onChange={(e) => {
                const price = parseFloat(
                  Number(e.target.value.replace(/^0+/, "")).toFixed(2)
                );
                e.target.value = price.toString();
                setProductData({
                  ...productData,
                  price,
                });
              }}
              type="number"
              value={productData.price}
              className="mb-2 w-full rounded border-2 p-3 outline-none"
            />
          </div>
          <div className="ml-1 flex w-2/4 flex-col">
            <label htmlFor="stock"> Stock:</label>
            <input
              id="stock"
              onChange={(e) => {
                if (isNaN(parseInt(e.target.value))) e.target.value = "0";
                setProductData({
                  ...productData,
                  stock: parseInt(e.target.value),
                });
              }}
              type="text"
              value={productData.stock}
              placeholder="Stock del producto"
              className="mb-2 w-full rounded border-2 p-3 outline-none"
            />
          </div>
        </div>
        <div className="flex">
          <label
            htmlFor="file-upload"
            className="text-grey-500 mr-1
          w-2/4 rounded
            border-2 border-solid
            bg-blue-50 py-2 px-6
            text-center text-sm
            font-medium text-blue-700
            hover:cursor-pointer hover:bg-amber-50
            hover:text-amber-700"
          >
            Seleccionar Imagen
          </label>
          <input
            type="submit"
            value="Añadir Producto"
            className="text-grey-500 ml-1
          w-2/4
            rounded border-2
            border-solid bg-blue-50 py-2
            px-6 text-sm
            font-medium text-blue-700
            hover:cursor-pointer hover:bg-amber-50
            hover:text-amber-700"
          />
        </div>
        <div className="flex justify-center p-5">
          {imageSrc && (
            <img
              className="max-w-xs rounded"
              src={imageSrc.toString()}
              alt=""
            />
          )}
        </div>
        <input
          onChange={(e) => handleOnChange(e)}
          className="absolute -left-[9999rem]"
          id="file-upload"
          type="file"
          name="file"
        />
      </form>
    </Layout>
  );
}
