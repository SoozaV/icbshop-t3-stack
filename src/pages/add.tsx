import { ChangeEvent, FormEvent, useState } from "react";
import Layout from "../components/Layout";
import { trpc } from "../utils/trpc";

type ProductData = {
  title: string;
  description: string;
  stock: number;
  price: number;
  imgUrl: string;
};

export default function AddProduct() {
  const [imageSrc, setImageSrc] = useState<string | ArrayBuffer | null>(null);
  const [imageFormData, setImageFormData] = useState<any>(); // ? Colocar el tipo de un FormData
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
      onLoadEvent.target ? setImageSrc(onLoadEvent.target.result) : null;
    const inputElement = changeEvent.target as HTMLFormElement;
    if (changeEvent.target) reader.readAsDataURL(inputElement.files[0]);

    // Agregando la imagen al productData.formData
    const form = changeEvent.currentTarget as HTMLFormElement;

    const formData = new FormData();
    formData.append("file", form.files[0]);
    formData.append("upload_preset", "icb-shop");

    setImageFormData(formData);
  };

  const addProduct = async ({
    e,
    productData,
  }: {
    e: FormEvent;
    productData: ProductData;
  }) => {
    e.preventDefault();
    // Intenté subir la imagen desde back dentro del método mutation pero siempre me daba error 400 Bad Request
    // tuve que hacer la subida aquí en lo que averiguo cómo se hace
    const imageResponse = await fetch(
      "https://api.cloudinary.com/v1_1/dnovht5lf/image/upload",
      {
        method: "POST",
        body: imageFormData,
      }
    ).then((res) => res.json());

    productEndpoint.mutateAsync({
      ...productData,
      imgUrl: imageResponse.url,
    });
  };

  return (
    <Layout>
      <form onSubmit={(e) => addProduct({ e, productData })}>
        <input
          onChange={(e) =>
            setProductData({ ...productData, title: e.target.value })
          }
          type="text"
          value={productData.title}
          placeholder="Título del producto"
        />
        <textarea
          onChange={(e) =>
            setProductData({ ...productData, description: e.target.value })
          }
          value={productData.description}
          placeholder="Descripción del producto"
        />
        <div>
          <input
            onChange={(e) =>
              setProductData({
                ...productData,
                price: parseFloat(e.target.value),
              })
            }
            type="text"
            value={productData.price}
            placeholder="Precio del producto"
          />
          <input
            onChange={(e) =>
              setProductData({
                ...productData,
                stock: parseInt(e.target.value),
              })
            }
            type="text"
            value={productData.stock}
            placeholder="Stock del producto"
          />
        </div>
        <label
          htmlFor="file-upload"
          className="text-grey-500 rounded-full
            border-0 bg-blue-50
            py-2 px-6
            text-sm
            font-medium text-blue-700
            hover:cursor-pointer hover:bg-amber-50
            hover:text-amber-700"
        >
          Seleccionar Imagen
        </label>
        <input type="submit" value="Añadir Producto" />
        {imageSrc && <img src={imageSrc.toString()} alt="" />}
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
