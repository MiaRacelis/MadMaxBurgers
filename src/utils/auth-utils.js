import { STORAGE_ITEMS, getItem } from './storage-utils';

export function getCurrentUser() {
    return getItem(STORAGE_ITEMS.user) || null;
}

export function isLoggedIn() {
    const isAuthenticated = getItem(STORAGE_ITEMS.isAuth) || false;
    return getCurrentUser() !== null && isAuthenticated;
}

export function removeAuth() {
    localStorage.removeItem(STORAGE_ITEMS.user);
    localStorage.removeItem(STORAGE_ITEMS.isAuth);
}