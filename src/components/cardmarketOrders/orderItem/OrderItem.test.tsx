import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderItem from './OrderItem';
import { CardmarketOrder } from '../../../api/generated/Schemas';

jest.mock('../../../containers/invoices/PDFInvoicePreview', () => () => <div data-testid="pdf-invoice-preview" />);
jest.mock('../../../containers/invoices/SendInvoiceEmailDialog', () => () => <div data-testid="send-invoice-email-dialog" />);
jest.mock('./OrderItemContent', () => () => <div data-testid="order-item-content" />);
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="icon" />,
}));
jest.mock('../../../customComponents/CustomIconButton', () => ({ title }: { title: string }) => (
    <button aria-label={title} />
));

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
    invoice: null,
};

const mockOrderWithInvoice: CardmarketOrder = {
    ...mockOrderWithoutInvoice,
    invoice: {
        id: 1,
        orderId: 42,
        createdAt: '2025-03-01T10:00:00Z',
        invoicePdf: null,
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
        expect(screen.getByText('Kunde: TestUser')).toBeInTheDocument();
    });

    it('shows order id', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByText(/Bestellnummer: 42/)).toBeInTheDocument();
    });

    it('does not show saved invoice indicator when invoice is null', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.queryByText('Rechnung gespeichert')).not.toBeInTheDocument();
    });

    it('shows saved invoice indicator when invoice is present', () => {
        renderWithProviders(mockOrderWithInvoice);
        expect(screen.getByText('Rechnung gespeichert')).toBeInTheDocument();
    });

    it('does not show saved indicator when invoice field is undefined', () => {
        const orderWithUndefinedInvoice = { ...mockOrderWithoutInvoice, invoice: undefined };
        renderWithProviders(orderWithUndefinedInvoice);
        expect(screen.queryByText('Rechnung gespeichert')).not.toBeInTheDocument();
    });
});
