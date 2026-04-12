import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import AddPurchaseInvoiceDrawer from './AddPurchaseInvoiceDrawer';
import type usePurchaseInvoiceFormType from '../../api/hooks/usePurchaseInvoiceForm';

// Provide a factory so Jest never tries to load the real module (which imports axios ESM).
jest.mock('../../api/hooks/usePurchaseInvoiceForm', () => ({
    __esModule: true,
    default: jest.fn(),
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const usePurchaseInvoiceForm: jest.MockedFunction<typeof usePurchaseInvoiceFormType> =
    require('../../api/hooks/usePurchaseInvoiceForm').default;

jest.mock('@mui/material', () => {
    const actual = jest.requireActual('@mui/material');
    return {
        ...actual,
        Drawer: ({ open, children }: { open: boolean; children: React.ReactNode }) =>
            open ? <div>{children}</div> : null,
    };
});

const buildDefaultFormState = (
    overrides: Partial<ReturnType<typeof usePurchaseInvoiceFormType>> = {}
): ReturnType<typeof usePurchaseInvoiceFormType> => ({
    konamiSets: [],
    produktname: '',
    setProduktname: jest.fn(),
    loading: false,
    message: '',
    setMessage: jest.fn(),
    error: '',
    setError: jest.fn(),
    handleSubmit: jest.fn((e: React.FormEvent) => { e.preventDefault(); return Promise.resolve(); }),
    ...overrides,
});

const renderWithProvider = (open = true) => {
    const store = createStore();
    return render(
        <Provider store={store}>
            <AddPurchaseInvoiceDrawer open={open} onClose={jest.fn()} />
        </Provider>
    );
};

describe('AddPurchaseInvoiceDrawer', () => {
    beforeEach(() => {
        usePurchaseInvoiceForm.mockReturnValue(buildDefaultFormState());
    });

    it('renders the form when open', () => {
        renderWithProvider();
        expect(screen.getByLabelText(/Produktname/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Hinzufügen' })).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        renderWithProvider(false);
        expect(screen.queryByRole('button', { name: 'Hinzufügen' })).not.toBeInTheDocument();
    });

    it('calls handleSubmit when the form is submitted', () => {
        const handleSubmit = jest.fn((e: React.FormEvent) => { e.preventDefault(); return Promise.resolve(); });
        usePurchaseInvoiceForm.mockReturnValue(buildDefaultFormState({ handleSubmit }));
        renderWithProvider();
        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));
        expect(handleSubmit).toHaveBeenCalled();
    });

    it('shows a success alert when message is set', () => {
        usePurchaseInvoiceForm.mockReturnValue(buildDefaultFormState({ message: 'Einkauf erfolgreich gespeichert!' }));
        renderWithProvider();
        expect(screen.getByText('Einkauf erfolgreich gespeichert!')).toBeInTheDocument();
    });

    it('shows an error alert when error is set', () => {
        usePurchaseInvoiceForm.mockReturnValue(buildDefaultFormState({ error: 'Speichern fehlgeschlagen.' }));
        renderWithProvider();
        expect(screen.getByText('Speichern fehlgeschlagen.')).toBeInTheDocument();
    });
});

