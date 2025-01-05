import React, { createContext, ReactNode, useState } from "react";
import { CartContextType } from "../types/CartContextType.ts";
import Product from "../../entities/Product.ts";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(
    [],
  );
  const [open, setOpen] = useState<boolean>(false);
  const [addedMessage, setAddedMessage] = useState<string|null>(null);

  const addToCart = (product: Product) => {
    const isInCartIndex = cart.findIndex(
      (item) => item.product.id_producto === product.id_producto,
    );
    // Si el carrito ya tiene a este producto, añadira 1 a su cantidad en lugar de añadir el producto
    if (isInCartIndex >= 0) {
      const updatedCart = cart.map((item, index) =>
        index === isInCartIndex
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      );
      setCart(updatedCart);
      const newQuantity = cart[isInCartIndex].quantity + 1;
      setAddedMessage(`"Ahora tienes ${newQuantity} del producto: ${product.nombre} en tu carrito."`);
      setTimeout(() => setAddedMessage(null), 3000);
    } else {
      setCart([...cart, { product, quantity: 1 }]);
      setAddedMessage(`"Se ha agregado el producto: ${product.nombre} a tu carrito"`);
      setTimeout(() => setAddedMessage(null), 3000);
    }
  };


  const removeFromCart = (product: Product) => {
    const isInCartIndex = cart.findIndex(
      (item) => item.product.id_producto === product.id_producto,
    );

    if (isInCartIndex >= 0) {
      const updatedCart = cart.filter((_, index) => index !== isInCartIndex);
      setCart(updatedCart);
    }
  };

  const updateQuantity = (product: Product, quantity: number) => {
    const isInCartIndex = cart.findIndex(
      (item) => item.product.id_producto === product.id_producto,
    );

    if (isInCartIndex >= 0) {
      const updatedCart = cart.map((item, index) =>
        index === isInCartIndex ? { ...item, quantity } : item,
      );
      setCart(updatedCart);
    }
  };

  const clearCart = () => {
    setCart([]);
  }

  const cartContextValue: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    addedMessage,
    open,
    setOpen,
    clearCart
  };

  return (
    <CartContext.Provider value={cartContextValue}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
