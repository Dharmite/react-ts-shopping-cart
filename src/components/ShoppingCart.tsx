import { Offcanvas, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import { formatCurrency } from '../utils/formatCurrency';
import { CartItem } from './CartItem';
import StoreItems from '../data/items.json';

export function ShoppingCart() {
    const { closeCart, getIsCartOpen, cartItems } = useShoppingCart();
    const isCartOpen = getIsCartOpen();
    const hasItems = cartItems.length > 0;

    if (!hasItems) {
        closeCart();
    }

    return (
        <Offcanvas placement='end' show={isCartOpen}>
            <Offcanvas.Header closeButton onHide={() => closeCart()}>
                <Offcanvas.Title>Cart</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Stack gap={3}>
                    <>
                        {cartItems.map((item) => (
                            <CartItem key={item.id} {...item} />
                        ))}
                        <div className='ms-auto fw-bold fs-5'>
                            Total{' '}
                            {formatCurrency(
                                cartItems.reduce((curr, item) => {
                                    const storeItem = StoreItems.find(
                                        (storeItem) => storeItem.id === item.id
                                    );
                                    return (
                                        curr +
                                        item.quantity * (storeItem?.price || 0)
                                    );
                                }, 0)
                            )}
                        </div>
                    </>
                </Stack>
            </Offcanvas.Body>
        </Offcanvas>
    );
}
