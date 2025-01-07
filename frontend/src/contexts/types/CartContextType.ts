import Product from "../../entities/Product.ts";

 export interface CartContextType {
    // Tipo usado para el contexto del carrito
    cart: {product : Product, quantity: number}[];
    addedMessage: string | null ;
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    updateQuantity: (product: Product, quantity: number) => void;
    open: boolean;
    setOpen: (isOpen:boolean) => void;
    clearCart: () => void;
}
