import { renderHook, act, waitFor } from '@testing-library/react';
import React from 'react';
import { Provider, createStore } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSendInvoiceEmailMutation } from './useSendInvoiceEmailMutation';
import { cardmarketOrdersAtom } from '../store/Global';
import { CardmarketOrder } from '../api/generated/Schemas';

jest.mock('./useOrdersQuery', () => ({
    __esModule: true,
    ORDERS_QUERY_KEY: ['orders'],
}));

jest.mock('../api/generated/email', () => ({
    __esModule: true,
    sendInvoiceEmail: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { sendInvoiceEmail } = require('../api/generated/email');

const mockOrderWithUnsentInvoice: CardmarketOrder = {
    customer: { user_name: 'Alice', is_professional: false },
    order_id: 1,
    payment_date: '2025-01-01',
    article_count: 1,
    merchandise_value: 10,
    shipment_cost: 2,
    total_value: 12,
    commission: 1,
    currency: 'EUR',
    invoice: {
        id: 7,
        orderId: 1,
        createdAt: '2025-01-01T12:00:00Z',
        invoicePdf: null,
        sent: false,
    },
};

const mockOrderWithSentInvoice: CardmarketOrder = {
    ...mockOrderWithUnsentInvoice,
    order_id: 2,
    invoice: {
        id: 8,
        orderId: 2,
        createdAt: '2025-01-02T12:00:00Z',
        invoicePdf: null,
        sent: false,
    },
};

const mockOrderWithoutInvoice: CardmarketOrder = {
    ...mockOrderWithUnsentInvoice,
    order_id: 3,
    invoice: null,
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

describe('useSendInvoiceEmailMutation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('calls sendInvoiceEmail with order id and request payload', async () => {
        sendInvoiceEmail.mockResolvedValue({ data: { message: 'ok' } });
        const store = createStore();
        store.set(cardmarketOrdersAtom, [mockOrderWithUnsentInvoice]);

        const { result } = renderHook(() => useSendInvoiceEmailMutation(), {
            wrapper: createWrapper(store),
        });

        await act(async () => {
            await result.current.mutateAsync({
                orderId: 1,
                request: { to: 'customer@example.com', subject: 'Bestellung 1' },
            });
        });

        expect(sendInvoiceEmail).toHaveBeenCalledWith(1, {
            to: 'customer@example.com',
            subject: 'Bestellung 1',
        });
    });

    it('sets invoice.sent to true only on the matching order', async () => {
        sendInvoiceEmail.mockResolvedValue({ data: { message: 'ok' } });
        const store = createStore();
        store.set(cardmarketOrdersAtom, [mockOrderWithUnsentInvoice, mockOrderWithSentInvoice]);
        const originalOtherOrderRef = store.get(cardmarketOrdersAtom)[1];

        const { result } = renderHook(() => useSendInvoiceEmailMutation(), {
            wrapper: createWrapper(store),
        });

        await act(async () => {
            await result.current.mutateAsync({ orderId: 1 });
        });

        await waitFor(() => result.current.isSuccess);

        const orders = store.get(cardmarketOrdersAtom);
        expect(orders[0].invoice?.sent).toBe(true);
        expect(orders[1].invoice?.sent).toBe(false);
        expect(orders[1]).toBe(originalOtherOrderRef);
    });

    it('does not create an invoice when the order has no invoice object yet', async () => {
        sendInvoiceEmail.mockResolvedValue({ data: { message: 'ok' } });
        const store = createStore();
        store.set(cardmarketOrdersAtom, [mockOrderWithoutInvoice]);

        const { result } = renderHook(() => useSendInvoiceEmailMutation(), {
            wrapper: createWrapper(store),
        });

        await act(async () => {
            await result.current.mutateAsync({ orderId: 3 });
        });

        await waitFor(() => result.current.isSuccess);

        const orders = store.get(cardmarketOrdersAtom);
        expect(orders[0].invoice).toBeNull();
    });
});

