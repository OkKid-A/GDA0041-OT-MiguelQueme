import {Theme} from "@mui/material";
import {makeStyles} from "@mui/styles";
import {useCart} from "../../hooks/useCart.ts";
import Layout from "../../components/layout/Layout.tsx";
import CartList from "../../components/product/CartList.tsx";


const useStyles = makeStyles((theme: Theme) =>({
    container: {
        padding: theme.spacing(3),
    },
}))

export const CartPage = () => {
    const { cart, removeFromCart, updateQuantity } = useCart();
    const classes = useStyles();
    console.log(cart);
    return (
        <Layout>
            <div className={classes.container}>
                <CartList products={cart} onRemoveFromCart={removeFromCart} onUpdateQuantity={updateQuantity}/>
            </div>
        </Layout>
    );
};