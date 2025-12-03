"use client";

import { useCart } from "@/app/context/cart-context";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Image } from "@heroui/image";
import { Divider } from "@heroui/divider";
import { X, Minus, Plus, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const {
    items,
    removeFromCart,
    updateQuantity,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
  } = useCart();

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-background shadow-xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" />
                <h2 className="text-lg font-semibold">
                  Shopping Cart ({items.length})
                </h2>
              </div>
              <Button
                isIconOnly
                variant="light"
                onPress={() => setIsCartOpen(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-default-500 space-y-4">
                  <ShoppingBag className="w-16 h-16 opacity-20" />
                  <p>Your cart is empty</p>
                  <Button
                    color="primary"
                    variant="flat"
                    onPress={() => setIsCartOpen(false)}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                items.map((item) => (
                  <Card key={item.id} className="w-full shadow-sm">
                    <CardBody className="flex flex-row gap-4 p-3">
                      <div className="relative w-20 h-20 shrink-0 bg-default-100 rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          classNames={{
                            wrapper: "w-full h-full",
                            img: "w-full h-full object-cover",
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium line-clamp-2 text-sm">
                            {item.name}
                          </h3>
                          <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            className="min-w-6 w-6 h-6 -mr-2 -mt-2"
                            onPress={() => removeFromCart(item.id)}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <p className="font-semibold text-primary">
                            {formatPrice(item.price)}
                          </p>
                          <div className="flex items-center gap-2 bg-default-100 rounded-lg p-1">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="w-6 h-6 min-w-6"
                              onPress={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="text-xs font-medium w-4 text-center">
                              {item.quantity}
                            </span>
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="w-6 h-6 min-w-6"
                              onPress={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-4 border-t border-divider bg-content1">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-default-500">Subtotal</span>
                  <span className="text-xl font-bold">
                    {formatPrice(cartTotal)}
                  </span>
                </div>
                <Button
                  color="primary"
                  size="lg"
                  className="w-full font-semibold"
                  endContent={<ShoppingBag className="w-4 h-4" />}
                >
                  Checkout
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
