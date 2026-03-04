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
        expect(result.current.produktname).toBeNull();
        expect(result.current.anzahlDisplays).toBe('');
        expect(result.current.preis).toBe('');
        expect(result.current.datum).toBe('');
        expect(result.current.pdfFile).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.message).toBe('');
        expect(result.current.error).toBe('');
    });

    it('sets error when produktname is missing on submit', async () => {
        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.error).toBe('Bitte einen Produktnamen auswählen.');
    });

    it('sets error when PDF is missing on submit', async () => {
        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
            result.current.setAnzahlDisplays('24');
            result.current.setPreis('1319.76');
            result.current.setDatum('2025-01-22');
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.error).toBe('Bitte eine PDF-Datei auswählen.');
    });

    it('sets error when amount is invalid', async () => {
        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });
        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
            result.current.setAnzahlDisplays('0');
            result.current.setPreis('1319.76');
            result.current.setDatum('2025-01-22');
            result.current.handleFileChange({
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.error).toBe('Bitte eine gültige Anzahl Displays eingeben.');
    });

    it('posts to the correct URL with FormData on successful submit', async () => {
        const savedInvoice = { id: 1, productName: 'Supreme Darkness', amount: 24, price: 1319.76, invoiceDate: '2025-01-22' };
        mockedAxiosPost.mockResolvedValue({ data: savedInvoice });

        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });
        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
            result.current.setAnzahlDisplays('24');
            result.current.setPreis('1319.76');
            result.current.setDatum('2025-01-22');
            result.current.handleFileChange({
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(mockedAxiosPost).toHaveBeenCalledWith('/v1/purchase-invoices', expect.any(FormData));
        expect(result.current.message).toBe('Einkauf erfolgreich gespeichert!');
        expect(result.current.error).toBe('');
    });

    it('sends invoiceData with id = 0 and application/json content type in the FormData', async () => {
        mockedAxiosPost.mockResolvedValue({ data: { id: 1, productName: 'Test', amount: 1, price: 10, invoiceDate: '2025-01-22' } });

        // Spy on FormData.prototype.append to capture the Blob before JSDOM stores it.
        const appendedParts: Record<string, Blob | File | string> = {};
        const appendSpy = jest.spyOn(FormData.prototype, 'append').mockImplementation(
            function (this: FormData, name: string, value: Blob | string) {
                appendedParts[name] = value as Blob | File | string;
            }
        );

        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });
        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
            result.current.setAnzahlDisplays('24');
            result.current.setPreis('1319.76');
            result.current.setDatum('2025-01-22');
            result.current.handleFileChange({
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        appendSpy.mockRestore();

        const invoiceDataBlob = appendedParts['invoiceData'] as Blob;
        expect(invoiceDataBlob).toBeInstanceOf(Blob);
        expect(invoiceDataBlob.type).toBe('application/json');

        // Read content synchronously via FileReaderSync polyfill pattern
        const invoiceDataContent: string = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(invoiceDataBlob);
        });
        const invoiceData = JSON.parse(invoiceDataContent);
        expect(invoiceData.id).toBe(0);
        expect(invoiceData.productName).toBe('Supreme Darkness');
    });

    it('sets error message when the API call fails', async () => {
        mockedAxiosPost.mockRejectedValue({ response: { data: { message: 'Server error' } } });

        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });
        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
            result.current.setAnzahlDisplays('24');
            result.current.setPreis('1319.76');
            result.current.setDatum('2025-01-22');
            result.current.handleFileChange({
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.error).toBe('Speichern fehlgeschlagen. Server error');
    });

    it('resets the form after successful submission', async () => {
        mockedAxiosPost.mockResolvedValue({ data: { id: 1, productName: 'Test', amount: 1, price: 10, invoiceDate: '2025-01-22' } });

        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });
        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });

        act(() => {
            result.current.setProduktname('Supreme Darkness');
            result.current.setAnzahlDisplays('24');
            result.current.setPreis('1319.76');
            result.current.setDatum('2025-01-22');
            result.current.handleFileChange({
                target: { files: [file] },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        });

        await act(async () => {
            await result.current.handleSubmit(buildValidFormEvent());
        });

        expect(result.current.produktname).toBeNull();
        expect(result.current.anzahlDisplays).toBe('');
        expect(result.current.preis).toBe('');
        expect(result.current.datum).toBe('');
        expect(result.current.pdfFile).toBeNull();
    });

    it('sets error when a non-PDF file is selected', () => {
        const { result } = renderHook(() => usePurchaseInvoiceForm(), { wrapper: createWrapper() });
        const txtFile = new File(['hello'], 'notes.txt', { type: 'text/plain' });

        act(() => {
            result.current.handleFileChange({
                target: { files: [txtFile] },
            } as unknown as React.ChangeEvent<HTMLInputElement>);
        });

        expect(result.current.error).toBe('Bitte eine gültige PDF-Datei auswählen.');
        expect(result.current.pdfFile).toBeNull();
    });
});
