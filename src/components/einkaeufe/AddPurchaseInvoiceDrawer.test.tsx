import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import AddPurchaseInvoiceDrawer from './AddPurchaseInvoiceDrawer';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        Autocomplete: ({ value, onChange }: { value: string | null; onChange: (e: unknown, v: string) => void }) => (
            <input
                aria-label="Produktname"
                value={value ?? ''}
                onChange={(e) => onChange(null, e.target.value)}
            />
        ),
        Drawer: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
            open ? <div>{children}</div> : null,
    };
});

jest.mock('../../api/generated/purchase-invoices', () => ({
    createPurchaseInvoice: jest.fn().mockResolvedValue({ data: { id: 1, productName: 'Test', amount: 1, price: 10, invoiceDate: '2025-01-22' } }),
}));

const renderWithProvider = (open = true) => {
    const store = createStore();
    return render(
        <Provider store={store}>
            <AddPurchaseInvoiceDrawer open={open} onClose={jest.fn()} />
        </Provider>
    );
};

describe('AddPurchaseInvoiceDrawer', () => {
    it('renders the form when open', () => {
        renderWithProvider();
        expect(screen.getByLabelText(/Produktname/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Anzahl Displays/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Preis/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Datum/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Hinzufügen' })).toBeInTheDocument();
    });

    it('shows error when produktname is missing on submit', async () => {
        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-22' } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        expect(await screen.findByText('Bitte einen Produktnamen auswählen.')).toBeInTheDocument();
    });

    it('shows error when PDF is missing on submit', async () => {
        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Produktname/), { target: { value: 'Supreme Darkness' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-22' } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        expect(await screen.findByText('Bitte eine PDF-Datei auswählen.')).toBeInTheDocument();
    });

    it('shows success message after successful submission', async () => {
        const { createPurchaseInvoice } = require('../../api/generated/purchase-invoices');
        createPurchaseInvoice.mockResolvedValue({ data: { id: 1, productName: 'Supreme Darkness', amount: 24, price: 1319.76, invoiceDate: '2025-01-22' } });

        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Produktname/), { target: { value: 'Supreme Darkness' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-22' } });

        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        expect(await screen.findByText('Einkauf erfolgreich gespeichert!')).toBeInTheDocument();
    });

    it('submits with id = 0 in the invoice data', async () => {
        const { createPurchaseInvoice } = require('../../api/generated/purchase-invoices');
        createPurchaseInvoice.mockResolvedValue({ data: { id: 1, productName: 'Test', amount: 1, price: 10, invoiceDate: '2025-01-22' } });

        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Produktname/), { target: { value: 'Supreme Darkness' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-22' } });

        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        await waitFor(() => {
            expect(createPurchaseInvoice).toHaveBeenCalledWith(
                expect.objectContaining({
                    invoiceData: expect.objectContaining({ id: 0 }),
                })
            );
        });
    });

    it('shows error message when the API call fails', async () => {
        const { createPurchaseInvoice } = require('../../api/generated/purchase-invoices');
        createPurchaseInvoice.mockRejectedValue({ response: { data: { message: 'Server error' } } });

        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Produktname/), { target: { value: 'Supreme Darkness' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-22' } });

        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        expect(await screen.findByText('Speichern fehlgeschlagen. Server error')).toBeInTheDocument();
    });
});
