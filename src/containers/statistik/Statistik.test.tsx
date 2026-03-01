import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { cardmarketOrdersAtom, startDateSelectAtom, endDateSelectAtom } from '../../store/Global';
import Statistik from './Statistik';
import dayjs from 'dayjs';

jest.mock('../../components/cardmarketOrders/filters/FilterDrawer', () => () => <div data-testid="filter-drawer" />);

const mockOrders = [
    {
        order_id: 1001,
        payment_date: '2024-01-15',
        total_value: 22.00,
        shipment_cost: 2.00,
        commission: 1.50,
        merchandise_value: 18.50,
        article_count: 2,
        currency: 'EUR',
        customer: { user_name: 'buyer1', is_professional: false },
        orderItems: [
            { id: 1, price: 10.00, count: 1, condition: 'NM', orderId: 1001, card: { product_name: 'Magic: The Gathering', name: 'Black Lotus', language: 'EN', rarity: 'R', product_id: 1, id: { id: 'a1', idMethod: 'x', idValue: 'v' } } },
            { id: 2, price: 8.50, count: 1, condition: 'NM', orderId: 1001, card: { product_name: 'Pokemon TCG', name: 'Charizard', language: 'EN', rarity: 'R', product_id: 2, id: { id: 'a2', idMethod: 'x', idValue: 'v' } } },
        ],
    },
    {
        order_id: 1002,
        payment_date: '2024-02-10',
        total_value: 15.00,
        shipment_cost: 1.50,
        commission: 0.80,
        merchandise_value: 12.70,
        article_count: 1,
        currency: 'EUR',
        customer: { user_name: 'buyer2', is_professional: false },
        orderItems: [
            { id: 3, price: 12.70, count: 1, condition: 'NM', orderId: 1002, card: { product_name: 'Yu-Gi-Oh!', name: 'Blue-Eyes White Dragon', language: 'EN', rarity: 'UR', product_id: 3, id: { id: 'a3', idMethod: 'x', idValue: 'v' } } },
        ],
    },
];

const renderWithStore = (orders = mockOrders) => {
    const store = createStore();
    store.set(cardmarketOrdersAtom, orders as any);
    store.set(startDateSelectAtom, dayjs('2024-01-01'));
    store.set(endDateSelectAtom, dayjs('2024-12-31'));
    return render(
        <Provider store={store}>
            <Statistik />
        </Provider>
    );
};

describe('Statistik', () => {
    it('renders monthly rows with expand toggle buttons', () => {
        renderWithStore();
        expect(screen.getByText('2024-01')).toBeInTheDocument();
        expect(screen.getByText('2024-02')).toBeInTheDocument();
        expect(screen.getAllByLabelText('Ausklappen')).toHaveLength(2);
    });

    it('product details are hidden before expansion', () => {
        renderWithStore();
        expect(screen.queryByText('Magic: The Gathering')).not.toBeInTheDocument();
        expect(screen.queryByText('Pokemon TCG')).not.toBeInTheDocument();
    });

    it('expands month to show product breakdown', () => {
        renderWithStore();
        const expandButtons = screen.getAllByLabelText('Ausklappen');
        fireEvent.click(expandButtons[0]);
        expect(screen.getByText('Magic: The Gathering')).toBeInTheDocument();
        expect(screen.getByText('Pokemon TCG')).toBeInTheDocument();
    });

    it('collapses month to hide product details', () => {
        renderWithStore();
        const expandButtons = screen.getAllByLabelText('Ausklappen');
        fireEvent.click(expandButtons[0]);
        // After expanding, button label changes to Einklappen
        expect(screen.getByLabelText('Einklappen')).toBeInTheDocument();
        fireEvent.click(screen.getByLabelText('Einklappen'));
        // After collapsing, button label returns to Ausklappen
        expect(screen.getAllByLabelText('Ausklappen')).toHaveLength(2);
    });

    it('product sub-table does not show Cardmarket Gebühren column', () => {
        renderWithStore();
        const expandButtons = screen.getAllByLabelText('Ausklappen');
        fireEvent.click(expandButtons[0]);
        const gebührenHeaders = screen.getAllByText(/Cardmarket Geb/i);
        // Only the main table header should show it, not the product sub-table
        expect(gebührenHeaders).toHaveLength(1);
    });

    it('shows product sub-table headers: Produkt, Gesamtwert, Versandkosten, Warenwert', () => {
        renderWithStore();
        const expandButtons = screen.getAllByLabelText('Ausklappen');
        fireEvent.click(expandButtons[0]);
        expect(screen.getByText('Produkt')).toBeInTheDocument();
    });

    it('expanding one month does not expand other months', () => {
        renderWithStore();
        const expandButtons = screen.getAllByLabelText('Ausklappen');
        fireEvent.click(expandButtons[0]);
        expect(screen.getByText('Magic: The Gathering')).toBeInTheDocument();
        expect(screen.queryByText('Yu-Gi-Oh!')).not.toBeInTheDocument();
    });

    it('shows no data message when orders list is empty', () => {
        renderWithStore([]);
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
    });

    it('shows no product data message when order has no items', () => {
        const ordersWithNoItems = [{ ...mockOrders[0], orderItems: undefined }];
        renderWithStore(ordersWithNoItems as any);
        const expandButtons = screen.getAllByLabelText('Ausklappen');
        fireEvent.click(expandButtons[0]);
        expect(screen.getByText('Keine Produktdaten vorhanden.')).toBeInTheDocument();
    });
});
