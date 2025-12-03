import { getProducts } from "@/app/lib/actions/products";
import ProductList from "./product-list";

export default async function AdminProductsPage() {
  const products = await getProducts();

  return <ProductList products={products} />;
}
