import { useContext } from "react";
import CartContext from "../contexts/carrito/CartContext.tsx";

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error(
            "El contexto del carrito ha presentado un error.",
        );
    }

    return context;
};
