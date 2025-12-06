"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { toast } from "@/app/components/ui/toast";
import { authClient } from "@/app/lib/auth-client";
import {
  addToCart as serverAddToCart,
  removeFromCart as serverRemoveFromCart,
  updateCartItemQuantity as serverUpdateQuantity,
  clearCart as serverClearCart,
  getCart as serverGetCart,
  mergeCart as serverMergeCart,
  type CartItemDTO,
} from "@/app/lib/actions/cart";

export type CartItem = {
  id: string; // This is productId
  name: string;
  price: number;
  image: string;
  quantity: number;
  maxStock: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isLoading: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { data: session } = authClient.useSession();

  // Helper to map DTO to CartItem
  const mapDtoToItem = (dto: CartItemDTO): CartItem => ({
    id: dto.productId,
    name: dto.product.name,
    price: dto.product.price,
    image: dto.product.images[0] || "",
    quantity: dto.quantity,
    maxStock: dto.product.stock,
  });

  // Initial load and sync logic
  useEffect(() => {
    const initCart = async () => {
      setIsLoading(true);
      const savedCart = localStorage.getItem("cart");
      let localItems: CartItem[] = [];

      if (savedCart) {
        try {
          localItems = JSON.parse(savedCart);
        } catch (e) {
          console.error("Failed to parse cart from localStorage", e);
        }
      }

      if (session?.user) {
        // User is logged in
        try {
          let serverItems: CartItemDTO[] = [];

          if (localItems.length > 0) {
            // Merge local items to server
            const itemsToMerge = localItems.map((item) => ({
              productId: item.id,
              quantity: item.quantity,
            }));
            serverItems = await serverMergeCart(itemsToMerge);
            // Clear local storage after merge
            localStorage.removeItem("cart");
          } else {
            // Just fetch server cart
            serverItems = await serverGetCart();
          }

          setItems(serverItems.map(mapDtoToItem));
        } catch (error) {
          console.error("Failed to sync cart", error);
          // Fallback to local if server fails? Or just show error?
          // For now, keep local items if sync fails to avoid data loss
          if (items.length === 0 && localItems.length > 0) {
            setItems(localItems);
          }
        }
      } else {
        // Guest user - use local items
        setItems(localItems);
      }
      setIsLoaded(true);
      setIsLoading(false);
    };

    initCart();
  }, [session?.user?.id]); // Re-run when user changes (login/logout)

  // Save to localStorage ONLY if guest
  useEffect(() => {
    if (isLoaded && !session?.user) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoaded, session?.user]);

  const addToCart = async (product: any) => {
    // Optimistic update
    const existing = items.find((item) => item.id === product.id);
    if (existing && existing.quantity >= product.stock) {
      toast.error(`Only ${product.stock} items available in stock`);
      return;
    }

    // Update state immediately
    let newItems = [...items];
    if (existing) {
      newItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      newItems = [
        ...items,
        {
          id: product.id,
          name: product.name,
          price:
            typeof product.price === "object"
              ? Number(product.price)
              : product.price,
          image: product.images[0],
          quantity: 1,
          maxStock: product.stock,
        },
      ];
    }
    setItems(newItems);
    toast.success("Added to cart");

    // Server sync if logged in
    if (session?.user) {
      try {
        const serverItems = await serverAddToCart(product.id, 1);
        setItems(serverItems.map(mapDtoToItem));
      } catch (error) {
        console.error("Failed to add to server cart", error);
        toast.error("Failed to sync with server");
        // Revert? For now, keep optimistic state
      }
    }
  };

  const removeFromCart = async (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));

    if (session?.user) {
      try {
        const serverItems = await serverRemoveFromCart(id);
        setItems(serverItems.map(mapDtoToItem));
      } catch (error) {
        console.error("Failed to remove from server cart", error);
      }
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }

    const item = items.find((i) => i.id === id);
    if (item && quantity > item.maxStock) {
      toast.error(`Only ${item.maxStock} items available`);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity };
        }
        return item;
      })
    );

    if (session?.user) {
      try {
        const serverItems = await serverUpdateQuantity(id, quantity);
        setItems(serverItems.map(mapDtoToItem));
      } catch (error) {
        console.error("Failed to update server cart", error);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    if (session?.user) {
      try {
        await serverClearCart();
      } catch (error) {
        console.error("Failed to clear server cart", error);
      }
    } else {
      localStorage.removeItem("cart");
    }
  };

  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
