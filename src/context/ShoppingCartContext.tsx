import { createContext, useContext, ReactNode, useState } from 'react';
import { ShoppingCart } from '../components/ShoppingCart';
import { useLocalStorage } from '../hooks/useLocaleStorage';

type ShoppingCartProviderProps = {
    children: ReactNode;
};

type ShoppingCartContext = {
    getItemQuantity: (id: number) => number;
    increaseItemQuantity: (id: number) => void;
    decreaseItemQuantity: (id: number) => void;
    removeFromCart: (id: number) => void;
    openCart: () => void;
    closeCart: () => void;
    cartQuantity: () => number;
    cartItems: CartItem[];
    getIsCartOpen: () => boolean;
};

export type CartItem = {
    id: number;
    quantity: number;
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
    return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({
    children,
}: ShoppingCartProviderProps): JSX.Element {
    const [cartItems, setCartItens] = useLocalStorage<CartItem[]>(
        'shopping-cart',
        []
    );
    const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

    function getItemQuantity(id: CartItem['id']): CartItem['quantity'] {
        return (
            cartItems.find((item: CartItem) => item.id === id)?.quantity || 0
        );
    }

    function increaseItemQuantity(id: CartItem['id']): void {
        setCartItens((currentItems: CartItem[]) => {
            if (currentItems.find((item: CartItem) => item.id === id) == null) {
                return [...currentItems, { id, quantity: 1 }];
            } else {
                return currentItems.map((item: CartItem) => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity + 1 };
                    } else {
                        return item;
                    }
                });
            }
        });
    }

    function decreaseItemQuantity(id: CartItem['id']): void {
        setCartItens((currentItems: CartItem[]) => {
            if (
                currentItems.find((item: CartItem) => item.id === id)
                    ?.quantity === 1
            ) {
                return currentItems.filter((item: CartItem) => item.id !== id);
            } else {
                return currentItems.map((item: CartItem) => {
                    if (item.id === id) {
                        return { ...item, quantity: item.quantity - 1 };
                    }

                    return item;
                });
            }
        });
    }

    function removeFromCart(id: CartItem['id']): void {
        setCartItens((_items: CartItem[]) => {
            return cartItems.filter((item: CartItem) => item.id !== id);
        });
    }

    function cartQuantity(): number {
        return cartItems.reduce((prev, curr) => {
            return prev + curr.quantity;
        }, 0);
    }

    function openCart(): void {
        setIsCartOpen(true);
    }

    function closeCart() {
        setIsCartOpen(false);
    }

    function getIsCartOpen(): boolean {
        return isCartOpen;
    }

    return (
        <ShoppingCartContext.Provider
            value={{
                getItemQuantity,
                increaseItemQuantity,
                decreaseItemQuantity,
                removeFromCart,
                cartQuantity,
                cartItems,
                openCart,
                closeCart,
                getIsCartOpen,
            }}
        >
            {children}
            <ShoppingCart />
        </ShoppingCartContext.Provider>
    );
}
