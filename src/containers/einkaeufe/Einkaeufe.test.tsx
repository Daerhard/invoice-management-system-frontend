import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import Einkaeufe from './Einkaeufe';

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        Autocomplete: ({ value, onChange }: any) =>
            React.createElement('input', {
                'aria-label': 'Produktname',
                value: value ?? '',
                onChange: (e: any) => onChange(null, e.target.value),
            }),
    };
});

jest.mock('../../api/hooks/useCardmarketOrders', () => () => {});

jest.mock('../../api/generated/purchase-invoices', () => ({
    createPurchaseInvoice: jest.fn().mockResolvedValue({}),
}));

const renderWithProvider = () => {
    const store = createStore();
    return render(
        <Provider store={store}>
            <Einkaeufe />
        </Provider>
    );
};

describe('Einkaeufe', () => {
    it('renders the form with all required fields', () => {
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
        createPurchaseInvoice.mockResolvedValue({});

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

    it('resets the form after successful submission', async () => {
        const { createPurchaseInvoice } = require('../../api/generated/purchase-invoices');
        createPurchaseInvoice.mockResolvedValue({});

        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Produktname/), { target: { value: 'Supreme Darkness' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        const datumInput = screen.getByLabelText(/Datum/) as HTMLInputElement;
        fireEvent.change(datumInput, { target: { value: '2025-01-22' } });

        const file = new File(['dummy'], 'rechnung.pdf', { type: 'application/pdf' });
        const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
        fireEvent.change(fileInput, { target: { files: [file] } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        await waitFor(() => {
            expect(datumInput.value).toBe('');
        });
    });

    it('shows an error message when the API call fails', async () => {
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
