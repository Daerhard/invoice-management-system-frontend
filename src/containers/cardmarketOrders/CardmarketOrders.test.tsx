import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
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

const renderWithProviders = () => {
    const queryClient = new QueryClient();
    const store = createStore();
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
});
