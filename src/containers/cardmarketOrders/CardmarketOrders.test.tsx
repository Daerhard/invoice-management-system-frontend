import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { cardmarketOrdersAtom } from '../../store/Global';
import CardmarketOrders from './CardmarketOrders';

jest.mock('../../api/hooks/useCustomers', () => ({ __esModule: true, default: () => {} }));
jest.mock('../../components/cardmarketOrders/filters/FilterDrawer', () => () => <div />);
jest.mock('../../components/cardmarketOrders/orderItem/OrderItem', () => ({ cardmarketOrder }: any) => (
    <div data-testid="order-item">{cardmarketOrder.order_id}</div>
));

const mockUseCardmarketOrders = jest.fn();
jest.mock('../../api/hooks/useCardmarketOrders', () => ({
    __esModule: true,
    default: () => mockUseCardmarketOrders(),
}));

const renderWithProviders = (initialOrders: any[] = []) => {
    const queryClient = new QueryClient();
    const store = createStore();
    if (initialOrders.length) {
        store.set(cardmarketOrdersAtom, initialOrders);
    }
    return render(
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <CardmarketOrders />
            </Provider>
        </QueryClientProvider>
    );
};

describe('CardmarketOrders', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('shows a loading spinner while orders are being fetched', () => {
        mockUseCardmarketOrders.mockReturnValue({ isLoading: true, isError: false });
        renderWithProviders();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('does not show the order list while loading', () => {
        mockUseCardmarketOrders.mockReturnValue({ isLoading: true, isError: false });
        renderWithProviders();
        expect(screen.queryByText('Keine Bestellungen vorhanden.')).not.toBeInTheDocument();
    });

    it('shows an error banner when the request fails', () => {
        mockUseCardmarketOrders.mockReturnValue({ isLoading: false, isError: true });
        renderWithProviders();
        expect(screen.getByText('Bestellungen konnten nicht geladen werden.')).toBeInTheDocument();
    });

    it('shows empty state message when loaded with no orders', () => {
        mockUseCardmarketOrders.mockReturnValue({ isLoading: false, isError: false });
        renderWithProviders();
        expect(screen.getByText('Keine Bestellungen vorhanden.')).toBeInTheDocument();
    });

    it('renders the Bestellungen heading', () => {
        mockUseCardmarketOrders.mockReturnValue({ isLoading: false, isError: false });
        renderWithProviders();
        expect(screen.getByText('Bestellungen')).toBeInTheDocument();
    });

    it('renders orders sorted by payment_date descending (newest first)', () => {
        mockUseCardmarketOrders.mockReturnValue({ isLoading: false, isError: false });

        const orders = [
            { order_id: 1, payment_date: '2024-01-01', customer: { user_name: 'a', is_professional: false }, article_count: 1, merchandise_value: 1, shipment_cost: 0, total_value: 1, commission: 0, currency: 'EUR' },
            { order_id: 2, payment_date: '2024-03-15', customer: { user_name: 'b', is_professional: false }, article_count: 1, merchandise_value: 1, shipment_cost: 0, total_value: 1, commission: 0, currency: 'EUR' },
            { order_id: 3, payment_date: '2024-02-10', customer: { user_name: 'c', is_professional: false }, article_count: 1, merchandise_value: 1, shipment_cost: 0, total_value: 1, commission: 0, currency: 'EUR' },
        ];

        renderWithProviders(orders);

        const items = screen.getAllByTestId('order-item');
        expect(items.map((el) => el.textContent)).toEqual(['2', '3', '1']);
    });
});
