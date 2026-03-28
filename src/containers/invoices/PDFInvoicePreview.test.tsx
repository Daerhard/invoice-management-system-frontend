import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, createStore } from 'jotai';
import PDFInvoicePreview from './PDFInvoicePreview';
import { CardmarketOrder } from '../../api/generated/Schemas';

jest.mock('../../api/generated/invoice-generation-pd-f', () => ({
    __esModule: true,
    getInvoicePDF: jest.fn(),
}));

jest.mock('../../api/generated/orders', () => ({
    __esModule: true,
    getOrders: jest.fn(),
    getOrdersByUserName: jest.fn(),
    createInvoice: jest.fn(),
}));

jest.mock('../../api/generated/invoice-email', () => ({
    __esModule: true,
    sendInvoiceEmail: jest.fn(),
    testSendInvoiceEmail: jest.fn(),
}));

jest.mock('../../api/hooks/useGenericRequest', () => ({
    useGenericRequest: jest.fn().mockReturnValue({ data: undefined }),
}));

jest.mock('../../queries/useSaveInvoiceMutation', () => ({
    useSaveInvoiceMutation: jest.fn(),
}));

jest.mock('../../queries/useSendInvoiceEmailMutation', () => ({
    useSendInvoiceEmailMutation: jest.fn(),
    useSendTestInvoiceEmailMutation: jest.fn(),
}));

jest.mock('../../components/invoices/InvoicePDF', () => () => <div data-testid="pdf-invoice" />);

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useGenericRequest } = require('../../api/hooks/useGenericRequest');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useSaveInvoiceMutation } = require('../../queries/useSaveInvoiceMutation');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useSendInvoiceEmailMutation, useSendTestInvoiceEmailMutation } = require('../../queries/useSendInvoiceEmailMutation');

const mockOrderUnsaved: CardmarketOrder = {
    customer: { user_name: 'TestUser', is_professional: false, email: 'test@example.com' },
    order_id: 12345,
    payment_date: '2025-01-15',
    article_count: 2,
    merchandise_value: 10,
    shipment_cost: 2,
    total_value: 12,
    commission: 1,
    currency: 'EUR',
    invoice: null,
};

const mockOrderNoEmail: CardmarketOrder = {
    ...mockOrderUnsaved,
    customer: { user_name: 'TestUser', is_professional: false, email: null },
};

const mockOrderSaved: CardmarketOrder = {
    ...mockOrderUnsaved,
    invoice: {
        id: 1,
        orderId: 12345,
        createdAt: '2025-01-15T10:00:00Z',
        invoicePdf: null,
    },
};

const renderWithProviders = (props: React.ComponentProps<typeof PDFInvoicePreview>) => {
    const queryClient = new QueryClient();
    const store = createStore();
    return render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PDFInvoicePreview {...props} />
            </Provider>
        </QueryClientProvider>
    );
};

describe('PDFInvoicePreview', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        useGenericRequest.mockReturnValue({ data: undefined });
        useSendInvoiceEmailMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        useSendTestInvoiceEmailMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
    });

    it('renders the dialog title', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        expect(screen.getByText('Rechnungsvorschau')).toBeInTheDocument();
    });

    it('shows "Rechnung speichern" button when invoice is not saved', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        expect(screen.getByRole('button', { name: /rechnung speichern/i })).toBeInTheDocument();
    });

    it('disables save button when invoice is already saved', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderSaved, open: true, onClose: jest.fn() });
        const saveButton = screen.getByRole('button', { name: /rechnung gespeichert/i });
        expect(saveButton).toBeDisabled();
    });

    it('disables save button while save is pending', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: true, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        const saveButton = screen.getByRole('button', { name: /rechnung speichern/i });
        expect(saveButton).toBeDisabled();
    });

    it('shows success message after saving', async () => {
        const mutateAsync = jest.fn().mockResolvedValue({});
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync, isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });

        fireEvent.click(screen.getByRole('button', { name: /rechnung speichern/i }));

        await waitFor(() => {
            expect(screen.getByText('Rechnung erfolgreich gespeichert!')).toBeInTheDocument();
        });
    });

    it('shows error message when save fails', async () => {
        const mutateAsync = jest.fn().mockRejectedValue(new Error('Server error'));
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync, isPending: false, isError: true });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });

        fireEvent.click(screen.getByRole('button', { name: /rechnung speichern/i }));

        await waitFor(() => {
            expect(screen.getByText('Speichern fehlgeschlagen.')).toBeInTheDocument();
        });
    });

    it('shows unavailable message when no invoice data', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        expect(screen.getByText('Vorschau ist im Moment nicht verfügbar')).toBeInTheDocument();
    });

    it('shows PDF viewer when generated invoice data is available', () => {
        useGenericRequest.mockReturnValue({ data: { data: new Blob(['pdf'], { type: 'application/pdf' }) } });
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        expect(screen.getByTestId('pdf-invoice')).toBeInTheDocument();
    });

    it('calls onClose when Schließen is clicked', () => {
        const onClose = jest.fn();
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose });
        fireEvent.click(screen.getByRole('button', { name: /schließen/i }));
        expect(onClose).toHaveBeenCalled();
    });

    // Email feature tests
    it('shows "Rechnung per E-Mail senden" button', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        expect(screen.getByRole('button', { name: /rechnung per e-mail senden/i })).toBeInTheDocument();
    });

    it('disables "Rechnung per E-Mail senden" button when customer has no email', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderNoEmail, open: true, onClose: jest.fn() });
        const emailButton = screen.getByRole('button', { name: /rechnung per e-mail senden/i });
        expect(emailButton).toBeDisabled();
    });

    it('shows warning when customer has no email', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderNoEmail, open: true, onClose: jest.fn() });
        expect(screen.getByText('Keine E-Mail-Adresse für diesen Kunden hinterlegt.')).toBeInTheDocument();
    });

    it('enables "Rechnung per E-Mail senden" button when customer has email', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        const emailButton = screen.getByRole('button', { name: /rechnung per e-mail senden/i });
        expect(emailButton).not.toBeDisabled();
    });

    it('shows success message after sending email', async () => {
        const mutateAsync = jest.fn().mockResolvedValue({});
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        useSendInvoiceEmailMutation.mockReturnValue({ mutateAsync, isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });

        fireEvent.click(screen.getByRole('button', { name: /rechnung per e-mail senden/i }));

        await waitFor(() => {
            expect(screen.getByText('E-Mail erfolgreich gesendet!')).toBeInTheDocument();
        });
    });

    it('shows error message when email sending fails', async () => {
        const mutateAsync = jest.fn().mockRejectedValue(new Error('Server error'));
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        useSendInvoiceEmailMutation.mockReturnValue({ mutateAsync, isPending: false, isError: true });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });

        fireEvent.click(screen.getByRole('button', { name: /rechnung per e-mail senden/i }));

        await waitFor(() => {
            expect(screen.getByText('E-Mail senden fehlgeschlagen.')).toBeInTheDocument();
        });
    });

    it('disables email send button while sending is pending', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        useSendInvoiceEmailMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: true, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        const emailButton = screen.getByRole('button', { name: /rechnung per e-mail senden/i });
        expect(emailButton).toBeDisabled();
    });

    it('shows test email input field', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        expect(screen.getByLabelText('Test E-Mail-Adresse')).toBeInTheDocument();
    });

    it('shows "Test E-Mail senden" button', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        expect(screen.getByRole('button', { name: /test e-mail senden/i })).toBeInTheDocument();
    });

    it('disables "Test E-Mail senden" button when test email is empty', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });
        const testButton = screen.getByRole('button', { name: /test e-mail senden/i });
        expect(testButton).toBeDisabled();
    });

    it('enables "Test E-Mail senden" button when test email is entered', () => {
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });

        fireEvent.change(screen.getByLabelText('Test E-Mail-Adresse'), {
            target: { value: 'custom@test.com' },
        });

        const testButton = screen.getByRole('button', { name: /test e-mail senden/i });
        expect(testButton).not.toBeDisabled();
    });

    it('shows success message after sending test email', async () => {
        const mutateAsync = jest.fn().mockResolvedValue({});
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        useSendTestInvoiceEmailMutation.mockReturnValue({ mutateAsync, isPending: false, isError: false });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });

        fireEvent.change(screen.getByLabelText('Test E-Mail-Adresse'), {
            target: { value: 'custom@test.com' },
        });
        fireEvent.click(screen.getByRole('button', { name: /test e-mail senden/i }));

        await waitFor(() => {
            expect(screen.getByText('Test-E-Mail erfolgreich gesendet!')).toBeInTheDocument();
        });
        expect(mutateAsync).toHaveBeenCalledWith({ testEmail: 'custom@test.com', bestellnummer: 12345 });
    });

    it('shows error message when test email sending fails', async () => {
        const mutateAsync = jest.fn().mockRejectedValue(new Error('Server error'));
        useSaveInvoiceMutation.mockReturnValue({ mutateAsync: jest.fn(), isPending: false, isError: false });
        useSendTestInvoiceEmailMutation.mockReturnValue({ mutateAsync, isPending: false, isError: true });
        renderWithProviders({ cardmarketOrder: mockOrderUnsaved, open: true, onClose: jest.fn() });

        fireEvent.change(screen.getByLabelText('Test E-Mail-Adresse'), {
            target: { value: 'custom@test.com' },
        });
        fireEvent.click(screen.getByRole('button', { name: /test e-mail senden/i }));

        await waitFor(() => {
            expect(screen.getByText('Test-E-Mail senden fehlgeschlagen.')).toBeInTheDocument();
        });
    });
});
