export const STORAGE_ITEMS = {
    orders: 'orders',
    customers: 'customers',
    products: 'products',
    users: 'users',
    user: 'user',
    isAuth: 'is_authenticated',
    carts: 'carts'
};

export function itemExists(itemName) {
    return !!localStorage.getItem(itemName);
}

export function getArrayFromStorage(itemName) {
    const item = localStorage.getItem(itemName);
    return item ? Array.from(JSON.parse(item)) : [];
}

export function getItem(itemName) {
    return JSON.parse(localStorage.getItem(itemName));
}

export function storeItems(itemName, items) {
    localStorage.setItem(itemName, JSON.stringify(items));
}
