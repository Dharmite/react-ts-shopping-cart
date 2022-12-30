import { Button, Stack } from 'react-bootstrap';
import { useShoppingCart } from '../context/ShoppingCartContext';
import type { CartItem } from '../context/ShoppingCartContext';
import StoreItems from '../data/items.json';
import { formatCurrency } from '../utils/formatCurrency';

export function CartItem({ id, quantity }: CartItem) {
    const { removeFromCart, cartItems } = useShoppingCart();
    console.log({ cartItems });
    const item = StoreItems.find((item) => item.id === id);
    if (!item) return null;
    return (
        <Stack direction='horizontal' gap={2}>
            <img
                src={item.imgUrl}
                style={{ width: '125px', height: '75px', objectFit: 'cover' }}
            />
            <div className='me-auto'>
                <div>
                    {item.name}{' '}
                    {quantity > 0 && (
                        <span
                            className='text-muted'
                            style={{ fontSize: '0.65rem' }}
                        >
                            x{quantity}
                        </span>
                    )}
                </div>

                <div className='text-muted' style={{ fontSize: '0.75rem' }}>
                    {formatCurrency(item.price)}
                </div>
            </div>
            <div>{formatCurrency(item.price * quantity)}</div>
            <Button
                size='sm'
                variant='outline-danger'
                onClick={() => removeFromCart(id)}
            >
                X
            </Button>
        </Stack>
    );
}
