import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import usePurchaseInvoiceForm from './usePurchaseInvoiceForm';

// Mock axios with a factory so Jest never tries to load the real ESM module.
jest.mock('axios', () => ({
    __esModule: true,
    default: { post: jest.fn() },
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mockedAxiosPost: jest.Mock = require('axios').default.post;

const createWrapper = () => {
    const store = createStore();
    return ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
    );
};

const buildValidFormEvent = () =>
    ({ preventDefault: jest.fn() } as unknown as React.FormEvent);

describe('usePurchaseInvoiceForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('initialises with empty form state', () => {
        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });
        expect(result.current.produktname).toBe('');
        expect(result.current.loading).toBe(false);
        expect(result.current.message).toBe('');
        expect(result.current.error).toBe('');
    });

    it('sets error when produktname is missing on submit', async () => {
        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.error).toBe('Bitte einen Produktnamen eingeben.');
    });

    it('posts to the correct URL with JSON body on successful submit', async () => {
        const savedInvoice = { id: 1, productName: 'Supreme Darkness', totalPrice: 0, items: [] };
        mockedAxiosPost.mockResolvedValue({ data: savedInvoice });

        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(mockedAxiosPost).toHaveBeenCalledWith(
            '/v1/purchase-invoices',
            { productName: 'Supreme Darkness' }
        );
        expect(result.current.message).toBe('Einkauf erfolgreich gespeichert!');
        expect(result.current.error).toBe('');
    });

    it('sets error message when the API call fails', async () => {
        mockedAxiosPost.mockRejectedValue({ response: { data: { message: 'Server error' } } });

        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.error).toBe('Speichern fehlgeschlagen. Server error');
    });

    it('resets the form after successful submission', async () => {
        mockedAxiosPost.mockResolvedValue({ data: { id: 1, productName: 'Test', totalPrice: 0, items: [] } });

        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.produktname).toBe('');
    });
});
