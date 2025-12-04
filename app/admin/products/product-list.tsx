"use client";

import { deleteProduct } from "@/app/lib/actions/products";
import { Button } from "@heroui/react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: any; // Decimal type handling
  stock: number;
  category: { name: string } | null;
};

export default function ProductList({ products }: { products: Product[] }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button as={Link} href="/admin/products/new" color="primary">
          Add Product
        </Button>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Price</th>
              <th className="p-4 font-medium">Stock</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <td className="p-4">{product.name}</td>
                <td className="p-4">${Number(product.price).toFixed(2)}</td>
                <td className="p-4">{product.stock}</td>
                <td className="p-4">
                  {product.category?.name || "Uncategorized"}
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      as={Link}
                      href={`/admin/products/${product.id}/edit`}
                      size="sm"
                      variant="light"
                    >
                      Edit
                    </Button>
                    <form action={deleteProduct.bind(null, product.id)}>
                      <Button
                        type="submit"
                        size="sm"
                        color="danger"
                        variant="light"
                      >
                        Delete
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500">
                  No products found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
