import React from "react";
import { useContext, useState, useEffect, createContext } from "react";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}

interface ProductContextType {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
}
const ProductContext = createContext<ProductContextType | null>(null);

export const ProductProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.event === "productCreated") {
        setProducts((prev) => [...prev, msg.data]);
      }
      if (msg.event === "productUpdated") {
        setProducts((prev) =>
          prev.map((p) => (p._id === msg.data._id ? msg.data : p))
        );
      }
      if (msg.event === "productDeleted") {
        setProducts((prev) => prev.filter((p) => p._id !== msg.data._id));
      }
      if (msg.event === "productsFetched") {
        setProducts(msg.data.products);
      }
    };
    return () => ws.close();
  }, []);

  return (
    <ProductContext.Provider value={{ products, setProducts }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext must be used within a ProductProvider");
  }
  return context;
};
