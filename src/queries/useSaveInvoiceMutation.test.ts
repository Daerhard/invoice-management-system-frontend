import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider, createStore } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSaveInvoiceMutation } from './useSaveInvoiceMutation';
import { cardmarketOrdersAtom } from '../store/Global';
import { CardmarketOrder, Invoice } from '../api/generated/Schemas';

jest.mock('../api/generated/orders', () => ({
    __esModule: true,
    createInvoice: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { createInvoice } = require('../api/generated/orders');

const mockOrder1: CardmarketOrder = {
    customer: { user_name: 'Alice', is_professional: false },
    order_id: 1,
    payment_date: '2025-01-01',
    article_count: 1,
    merchandise_value: 5,
    shipment_cost: 1,
    total_value: 6,
    commission: 0.5,
    currency: 'EUR',
};

const mockOrder2: CardmarketOrder = {
    customer: { user_name: 'Bob', is_professional: true },
    order_id: 2,
    payment_date: '2025-01-02',
    article_count: 2,
    merchandise_value: 10,
    shipment_cost: 2,
    total_value: 12,
    commission: 1,
    currency: 'EUR',
};

const mockInvoice: Invoice = {
    id: 99,
    orderId: 1,
    createdAt: '2025-01-01T12:00:00Z',
    invoicePdf: null,
    sent: false,
};

const createWrapper = (store: ReturnType<typeof createStore>) => {
    const queryClient = new QueryClient({ defaultOptions: { mutations: { retry: false } } });
    return ({ children }: { children: React.ReactNode }) =>
        React.createElement(
            QueryClientProvider,
            { client: queryClient },
            React.createElement(Provider, { store }, children)
        );
};

describe('useSaveInvoiceMutation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls createInvoice with the given orderId', async () => {
        createInvoice.mockResolvedValue({ data: mockInvoice });
        const store = createStore();
        store.set(cardmarketOrdersAtom, [mockOrder1]);

        const { result } = renderHook(() => useSaveInvoiceMutation(), {
            wrapper: createWrapper(store),
        });

        await act(async () => {
            await result.current.mutateAsync(1);
        });

        expect(createInvoice).toHaveBeenCalledWith(1);
    });

    it('patches only the saved order in cardmarketOrdersAtom with the returned invoice', async () => {
        createInvoice.mockResolvedValue({ data: mockInvoice });
        const store = createStore();
        store.set(cardmarketOrdersAtom, [mockOrder1, mockOrder2]);

        const { result } = renderHook(() => useSaveInvoiceMutation(), {
            wrapper: createWrapper(store),
        });

        await act(async () => {
            await result.current.mutateAsync(1);
        });

        await waitFor(() => result.current.isSuccess);

        const orders = store.get(cardmarketOrdersAtom);
        expect(orders[0].invoice).toEqual(mockInvoice);
        expect(orders[1].invoice).toBeUndefined();
    });

    it('leaves unrelated orders unchanged in the atom', async () => {
        createInvoice.mockResolvedValue({ data: mockInvoice });
        const store = createStore();
        store.set(cardmarketOrdersAtom, [mockOrder1, mockOrder2]);
        const originalOrder2Ref = store.get(cardmarketOrdersAtom)[1];

        const { result } = renderHook(() => useSaveInvoiceMutation(), {
            wrapper: createWrapper(store),
        });

        await act(async () => {
            await result.current.mutateAsync(1);
        });

        await waitFor(() => result.current.isSuccess);

        const orders = store.get(cardmarketOrdersAtom);
        expect(orders[1]).toBe(originalOrder2Ref);
    });

    it('does not mutate the atom when createInvoice rejects', async () => {
        createInvoice.mockRejectedValue(new Error('Network error'));
        const store = createStore();
        store.set(cardmarketOrdersAtom, [mockOrder1]);

        const { result } = renderHook(() => useSaveInvoiceMutation(), {
            wrapper: createWrapper(store),
        });

        await act(async () => {
            try {
                await result.current.mutateAsync(1);
            } catch {
                // expected
            }
        });

        const orders = store.get(cardmarketOrdersAtom);
        expect(orders[0].invoice).toBeUndefined();
    });
});
