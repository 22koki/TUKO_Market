import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const addItem = (product) => setItems((current) => {
    const found = current.find((item) => item.id === product.id);
    if (found) return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
    return [...current, { ...product, quantity: 1 }];
  });

  const updateQuantity = (id, quantity) => setItems((current) =>
    current.map((item) => item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item)
  );

  const removeItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const clearCart = () => setItems([]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const value = useMemo(() => ({ items, addItem, updateQuantity, removeItem, clearCart, count, subtotal }), [items, count, subtotal]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
