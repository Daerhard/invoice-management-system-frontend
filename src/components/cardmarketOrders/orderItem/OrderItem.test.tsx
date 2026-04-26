import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderItem from './OrderItem';
import { CardmarketOrder } from '../../../api/generated/Schemas';

jest.mock('../../../containers/invoices/PDFInvoicePreview', () => () => <div data-testid="pdf-invoice-preview" />);
jest.mock('../../../containers/invoices/SendInvoiceEmailDialog', () => () => <div data-testid="send-invoice-email-dialog" />);
jest.mock('./OrderItemContent', () => () => <div data-testid="order-item-content" />);

const mockOrderWithoutInvoice: CardmarketOrder = {
    customer: { user_name: 'TestUser', is_professional: false },
    order_id: 42,
    payment_date: '2025-03-01',
    article_count: 3,
    merchandise_value: 15,
    shipment_cost: 3,
    total_value: 18,
    commission: 1.5,
    currency: 'EUR',
};

const mockProfessionalOrder: CardmarketOrder = {
    ...mockOrderWithoutInvoice,
    customer: { user_name: 'ProUser', is_professional: true },
};

const mockOrderWithInvoice: CardmarketOrder = {
    ...mockOrderWithoutInvoice,
    invoice: {
        id: 1,
        orderId: 42,
        createdAt: '2025-03-01T10:00:00Z',
        invoicePdf: null,
        sent: false,
    },
};

const mockOrderWithSentInvoice: CardmarketOrder = {
    ...mockOrderWithoutInvoice,
    invoice: {
        id: 1,
        orderId: 42,
        createdAt: '2025-03-01T10:00:00Z',
        invoicePdf: null,
        sent: true,
    },
};

const renderWithProviders = (cardmarketOrder: CardmarketOrder) => {
    const store = createStore();
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <OrderItem cardmarketOrder={cardmarketOrder} />
            </Provider>
        </QueryClientProvider>
    );
};

describe('OrderItem', () => {
    it('shows customer name', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByText('TestUser')).toBeInTheDocument();
    });

    it('shows order id', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByText(/#42/)).toBeInTheDocument();
    });

    it('shows action buttons for PDF, E-invoice and send email', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByRole('button', { name: 'Rechnung PDF' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'E-Rechnung' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'E-Mail senden' })).toBeInTheDocument();
    });

    it('shows details toggle button', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByRole('button', { name: 'Details' })).toBeInTheDocument();
    });

    it('opens send email dialog when clicking send button for professional customer', () => {
        renderWithProviders(mockProfessionalOrder);
        expect(screen.queryByTestId('send-invoice-email-dialog')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'E-Mail senden' }));

        expect(screen.getByTestId('send-invoice-email-dialog')).toBeInTheDocument();
    });

    it('send email button is disabled for non-professional customers', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByRole('button', { name: 'E-Mail senden' })).toBeDisabled();
    });

    it('send email button is enabled for professional customers', () => {
        renderWithProviders(mockProfessionalOrder);
        expect(screen.getByRole('button', { name: 'E-Mail senden' })).not.toBeDisabled();
    });

    it('opens PDF invoice preview on button click', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.queryByTestId('pdf-invoice-preview')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Rechnung PDF' }));

        expect(screen.getByTestId('pdf-invoice-preview')).toBeInTheDocument();
    });

    it('shows Gewerblich chip for professional customers', () => {
        renderWithProviders(mockProfessionalOrder);
        expect(screen.getByText('Gewerblich')).toBeInTheDocument();
    });

    it('does not show Gewerblich chip for non-professional customers', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.queryByText('Gewerblich')).not.toBeInTheDocument();
    });

    it('expands order details on toggle click', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.queryByTestId('order-item-content')).not.toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'Details' }));

        expect(screen.getByTestId('order-item-content')).toBeInTheDocument();
    });

    it('invoice PDF button is rendered for orders with and without saved invoice', () => {
        const { rerender } = renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByRole('button', { name: 'Rechnung PDF' })).toBeInTheDocument();

        const store = createStore();
        const queryClient = new QueryClient();
        rerender(
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <OrderItem cardmarketOrder={mockOrderWithInvoice} />
                </Provider>
            </QueryClientProvider>
        );
        expect(screen.getByRole('button', { name: /Rechnung PDF/ })).toBeInTheDocument();
    });
});
