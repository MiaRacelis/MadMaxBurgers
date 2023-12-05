import { STORAGE_ITEMS, getArrayFromStorage, storeItems } from './storage-utils';
import { getCurrentDateTime } from './date-utils';

export function getUserCart(userId) {
    const carts = getArrayFromStorage(STORAGE_ITEMS.carts);
    const userCart = carts.find(cart => cart.customer_id === userId);
    return userCart || { customer_id: userId, items: [] };
}

export function getUserCartItems(userId) {
    const userCart = getUserCart(userId);
    return userCart ? Array.from(userCart.items)
        .filter(item => item.order_quantity > 0) : [];
}

export function clearCartItems(userId) {
    const carts = getArrayFromStorage(STORAGE_ITEMS.carts);
    storeItems(STORAGE_ITEMS.carts, carts.filter(cart => cart.customer_id !== userId));
}

export function generateOrderId() {
    const randomId = Array.from(Array(6), () => Math.floor(Math.random() * 36)
        .toString(36)).join('')
        .toUpperCase();
    return `MDMXB-${randomId}`;
}

export function mapToOrder(user, deliveryInstructions) {
    const userCartItems = getUserCartItems(user.id);
    const { password, role, signup_date, ...rest } = user;
    return {
        id: generateOrderId(),
        order_date_time: getCurrentDateTime(),
        payment_mode: 'Cash on Delivery',
        status: 'preparing',
        notes: '',
        delivery_instructions: deliveryInstructions,
        customer: rest,
        items: userCartItems.map(item => {
            const { order_quantity, ...rest } = item;
            return { product: rest, quantity: order_quantity }
        })
    };
}
