import { useSyncExternalStore } from 'react';

const STORAGE_KEY = 'bison-req';

let items = [];
let open = false;
let hydrated = false;
let snapshot = { items, open };
const listeners = new Set();

function hydrate() {
    if (hydrated || typeof window === 'undefined') {
        return;
    }

    hydrated = true;

    try {
        const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]');
        items = Array.isArray(parsed) ? parsed : [];
    } catch {
        items = [];
    }

    snapshot = { items, open };
}

function commit(persist = true) {
    snapshot = { items, open };

    if (persist && typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch {
            // Storage can be unavailable in private browsing.
        }
    }

    listeners.forEach((listener) => listener());
}

function subscribe(listener) {
    hydrate();
    listeners.add(listener);

    return () => listeners.delete(listener);
}

function getSnapshot() {
    hydrate();

    return snapshot;
}

const serverSnapshot = { items: [], open: false };

export function useRequestCart() {
    return useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);
}

export function addRequestItem(item) {
    hydrate();

    if (items.some((row) => row.sku === item.sku)) {
        return;
    }

    items = [...items, { ...item, qty: item.qty ?? '' }];
    commit();
}

export function removeRequestItem(index) {
    hydrate();
    items = items.filter((_, itemIndex) => itemIndex !== index);
    commit();
}

export function setRequestQty(index, qty) {
    hydrate();
    items = items.map((item, itemIndex) => (
        itemIndex === index ? { ...item, qty: String(qty).replace(/[^0-9]/g, '') } : item
    ));
    commit();
}

export function clearRequestItems() {
    hydrate();
    items = [];
    commit();
}

export function openRequest() {
    hydrate();
    open = true;
    commit(false);
}

export function closeRequest() {
    hydrate();
    open = false;
    commit(false);
}
