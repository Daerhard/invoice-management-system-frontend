import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import OrderItem from './OrderItem';
import { CardmarketOrder } from '../../../api/generated/Schemas';

jest.mock('../../../containers/invoices/PDFInvoicePreview', () => () => <div data-testid="pdf-invoice-preview" />);
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
    it('shows customer name without "Kunde:" prefix', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByText('TestUser')).toBeInTheDocument();
        expect(screen.queryByText('Kunde: TestUser')).not.toBeInTheDocument();
    });

    it('shows order id', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByText(/Bestellnummer: 42/)).toBeInTheDocument();
    });

    it('shows "Öffne Bestelldetails" button in subheader row', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByRole('button', { name: 'Öffne Bestelldetails' })).toBeInTheDocument();
    });

    it('shows action buttons for Rechnung (PDF), Rechnung (E) and Versenden', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByRole('button', { name: 'Rechnung (PDF)' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Rechnung (E)' })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Versenden' })).toBeInTheDocument();
    });

    it('always renders the pdf invoice ticker', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByTestId('pdf-invoice-ticker')).toBeInTheDocument();
    });

    it('always renders the e-invoice ticker', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByTestId('e-invoice-ticker')).toBeInTheDocument();
    });

    it('always renders the send-invoice ticker', () => {
        renderWithProviders(mockOrderWithoutInvoice);
        expect(screen.getByTestId('send-invoice-ticker')).toBeInTheDocument();
    });

    it('pdf ticker shows success color when invoice is saved', () => {
        renderWithProviders(mockOrderWithInvoice);
        const ticker = screen.getByTestId('pdf-invoice-ticker');
        expect(ticker).toBeInTheDocument();
    });

    it('does not show "Rechnung gespeichert" as visible text', () => {
        renderWithProviders(mockOrderWithInvoice);
        expect(screen.queryByText('Rechnung gespeichert')).not.toBeInTheDocument();
    });
});

