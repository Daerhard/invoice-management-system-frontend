import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider, createStore } from 'jotai';
import SendInvoiceEmailDialog from './SendInvoiceEmailDialog';
import { CardmarketOrder } from '../../api/generated/Schemas';

jest.mock('../../api/generated/email', () => ({
    __esModule: true,
    sendInvoiceEmail: jest.fn(),
}));

jest.mock('../../queries/useSendInvoiceEmailMutation', () => ({
    useSendInvoiceEmailMutation: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { useSendInvoiceEmailMutation } = require('../../queries/useSendInvoiceEmailMutation');

const mockOrder: CardmarketOrder = {
    customer: { user_name: 'TestUser', is_professional: true, email: 'test@example.com' },
    order_id: 99,
    payment_date: '2025-06-01',
    article_count: 1,
    merchandise_value: 5,
    shipment_cost: 2,
    total_value: 7,
    commission: 0.5,
    currency: 'EUR',
};

const mockOrderNoEmail: CardmarketOrder = {
    ...mockOrder,
    customer: { user_name: 'NoEmailUser', is_professional: true },
};

const renderDialog = (props: Partial<React.ComponentProps<typeof SendInvoiceEmailDialog>> = {}) => {
    const queryClient = new QueryClient();
    const store = createStore();
    return render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <SendInvoiceEmailDialog
                    cardmarketOrder={mockOrder}
                    open={true}
                    onClose={jest.fn()}
                    {...props}
                />
            </Provider>
        </QueryClientProvider>
    );
};

describe('SendInvoiceEmailDialog', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the dialog title', () => {
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog();
        expect(screen.getByText('Rechnung per E-Mail senden')).toBeInTheDocument();
    });

    it('displays customer name and order id', () => {
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog();
        expect(screen.getByText(/TestUser/)).toBeInTheDocument();
        expect(screen.getByText(/99/)).toBeInTheDocument();
    });

    it('displays customer email when available', () => {
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog();
        expect(screen.getByText(/test@example\.com/)).toBeInTheDocument();
    });

    it('shows warning and disables send button when customer has no email', () => {
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog({ cardmarketOrder: mockOrderNoEmail });
        expect(screen.getByTestId('no-email-warning')).toBeInTheDocument();
        expect(screen.getByText('Für diesen Kunden ist keine E-Mail-Adresse hinterlegt.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /senden/i })).toBeDisabled();
    });

    it('shows "Zum Kunden" button when customer has no email', () => {
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog({ cardmarketOrder: mockOrderNoEmail });
        expect(screen.getByTestId('navigate-to-customer-button')).toBeInTheDocument();
    });

    it('does not show "Zum Kunden" button when customer has an email', () => {
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog();
        expect(screen.queryByTestId('navigate-to-customer-button')).not.toBeInTheDocument();
    });

    it('disables send button while pending', () => {
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: true,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog();
        expect(screen.getByRole('button', { name: /senden/i })).toBeDisabled();
    });

    it('shows success message after sending', async () => {
        const mutateAsync = jest.fn().mockResolvedValue({});
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync,
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog();
        fireEvent.click(screen.getByRole('button', { name: /senden/i }));
        await waitFor(() => {
            expect(screen.getByText('E-Mail erfolgreich gesendet!')).toBeInTheDocument();
        });
    });

    it('shows error message when sending fails', async () => {
        const mutateAsync = jest.fn().mockRejectedValue(new Error('Network error'));
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync,
            isPending: false,
            isError: true,
            reset: jest.fn(),
        });
        renderDialog();
        fireEvent.click(screen.getByRole('button', { name: /senden/i }));
        await waitFor(() => {
            expect(screen.getByText('E-Mail konnte nicht gesendet werden.')).toBeInTheDocument();
        });
    });

    it('calls onClose when Abbrechen is clicked', () => {
        const onClose = jest.fn();
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync: jest.fn(),
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog({ onClose });
        fireEvent.click(screen.getByRole('button', { name: /abbrechen/i }));
        expect(onClose).toHaveBeenCalled();
    });

    it('calls sendInvoiceEmail mutation with correct arguments', async () => {
        const mutateAsync = jest.fn().mockResolvedValue({});
        useSendInvoiceEmailMutation.mockReturnValue({
            mutateAsync,
            isPending: false,
            isError: false,
            reset: jest.fn(),
        });
        renderDialog();
        fireEvent.click(screen.getByRole('button', { name: /senden/i }));
        await waitFor(() => {
            expect(mutateAsync).toHaveBeenCalledWith({
                orderId: 99,
                request: {
                    to: 'test@example.com',
                    subject: 'Bestellung 99',
                },
            });
        });
    });
});
