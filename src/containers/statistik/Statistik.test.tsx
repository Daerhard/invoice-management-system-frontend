import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { cardmarketOrdersAtom, startDateSelectAtom, endDateSelectAtom, purchaseInvoicesAtom } from '../../store/Global';
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
            { id: 1, price: 10.00, count: 1, condition: 'NM', orderId: 1001, card: { product_name: 'Yu-Gi-Oh!', name: 'Black Luster Soldier', language: 'EN', rarity: 'R', product_id: 1, id: { konamiSet: 'Darkwing Blast', number: 'DABL-EN001' } } },
            { id: 2, price: 8.50, count: 1, condition: 'NM', orderId: 1001, card: { product_name: 'Yu-Gi-Oh!', name: 'Ash Blossom', language: 'EN', rarity: 'R', product_id: 2, id: { konamiSet: 'Phantom Rage', number: 'PHRA-EN020' } } },
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
            { id: 3, price: 12.70, count: 1, condition: 'NM', orderId: 1002, card: { product_name: 'Yu-Gi-Oh!', name: 'Blue-Eyes White Dragon', language: 'EN', rarity: 'UR', product_id: 3, id: { konamiSet: 'Legend of Blue Eyes', number: 'LOB-EN001' } } },
        ],
    },
];

const mockPurchaseInvoices = [
    { id: 1, productName: 'Darkwing Blast', amount: 1, price: 7.50, invoiceDate: '2024-01-10' },
];

const renderWithStore = (orders = mockOrders, purchaseInvoices = mockPurchaseInvoices) => {
    const store = createStore();
    store.set(cardmarketOrdersAtom, orders as any);
    store.set(startDateSelectAtom, dayjs('2024-01-01'));
    store.set(endDateSelectAtom, dayjs('2024-12-31'));
    store.set(purchaseInvoicesAtom, purchaseInvoices as any);
    return render(
        <Provider store={store}>
            <Statistik />
        </Provider>
    );
};

describe('Statistik', () => {
    it('renders all three tabs with Profit Übersicht first', () => {
        renderWithStore();
        const tabs = screen.getAllByRole('tab');
        expect(tabs[0]).toHaveTextContent('Profit Übersicht');
        expect(tabs[1]).toHaveTextContent('Monatsübersicht');
        expect(tabs[2]).toHaveTextContent('Set-Statistik');
    });

    it('shows Profit Übersicht tab by default', () => {
        renderWithStore();
        expect(screen.getByText('Best Sets')).toBeInTheDocument();
        expect(screen.getByText('Worst Sets')).toBeInTheDocument();
    });

    it('Profit Übersicht shows Best Sets chart with data when profitable sets exist', () => {
        renderWithStore();
        // Darkwing Blast has profit 2.5 (> 0)
        expect(screen.getByRole('img', { name: 'Best Sets' })).toBeInTheDocument();
    });

    it('Profit Übersicht shows Worst Sets as disabled when no loss-making sets exist', () => {
        renderWithStore();
        // No sets with negative profit in mockData
        const noDataMessages = screen.getAllByText('Keine Daten vorhanden.');
        expect(noDataMessages.length).toBeGreaterThanOrEqual(1);
    });

    it('Profit Übersicht shows correct total for best sets', () => {
        renderWithStore();
        // Darkwing Blast: profit 2.5
        expect(screen.getByText('Gesamt: 2.50 €')).toBeInTheDocument();
    });

    it('Profit Übersicht shows both charts disabled when there are no orders', () => {
        renderWithStore([]);
        const noDataMessages = screen.getAllByText('Keine Daten vorhanden.');
        expect(noDataMessages.length).toBe(2);
    });

    it('Profit Übersicht shows both charts disabled when no sets have known profit', () => {
        renderWithStore(mockOrders, []);
        const noDataMessages = screen.getAllByText('Keine Daten vorhanden.');
        expect(noDataMessages.length).toBe(2);
    });

    it('Profit Übersicht shows Worst Sets chart with data for loss-making sets', () => {
        const invoicesWithHighPrice = [
            { id: 1, productName: 'Darkwing Blast', amount: 1, price: 15.00, invoiceDate: '2024-01-10' },
        ];
        renderWithStore(mockOrders, invoicesWithHighPrice);
        // Darkwing Blast: profit = 10 - 15 = -5 (loss)
        expect(screen.getByRole('img', { name: 'Worst Sets' })).toBeInTheDocument();
        expect(screen.getByText('Gesamt: -5.00 €')).toBeInTheDocument();
    });

    it('shows monthly rows in Monatsübersicht tab after clicking it', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        expect(screen.getByText('2024-01')).toBeInTheDocument();
        expect(screen.getByText('2024-02')).toBeInTheDocument();
    });

    it('shows a Gesamt totals row in Monatsübersicht tab', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        expect(screen.getByText('Gesamt')).toBeInTheDocument();
    });

    it('Gesamt row sums totalValue across all months', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        // order 1001: totalValue 22, order 1002: totalValue 15 → total 37
        expect(screen.getByText('37')).toBeInTheDocument();
    });

    it('Gesamt row sums merchandiseValue across all months', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        // order 1001: merchandiseValue 18.50, order 1002: 12.70 → total 31.20
        expect(screen.getByText('31.2')).toBeInTheDocument();
    });

    it('does not show Gesamt row when there are no orders', () => {
        renderWithStore([]);
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        expect(screen.queryByText('Gesamt')).not.toBeInTheDocument();
    });

    it('monthly tab no longer has expand/collapse buttons', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        expect(screen.queryByLabelText('Ausklappen')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Einklappen')).not.toBeInTheDocument();
    });

    it('shows no data message when orders list is empty on Monatsübersicht tab', () => {
        renderWithStore([]);
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
    });

    it('switches to Set-Statistik tab and shows set filter input', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        expect(screen.getByLabelText('Set filtern')).toBeInTheDocument();
    });

    it('Set-Statistik tab shows sets with aggregated Warenwert', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        expect(screen.getByText('Darkwing Blast')).toBeInTheDocument();
        expect(screen.getByText('Phantom Rage')).toBeInTheDocument();
        expect(screen.getByText('Legend of Blue Eyes')).toBeInTheDocument();
    });

    it('Set-Statistik tab only shows Warenwert column (no Gesamtwert or Versandkosten)', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        expect(screen.queryByText('Gesamtwert (€)')).not.toBeInTheDocument();
        expect(screen.queryByText('Versandkosten (€)')).not.toBeInTheDocument();
        expect(screen.getByText('Warenwert (€)')).toBeInTheDocument();
        expect(screen.getByText('Einkaufspreis (€)')).toBeInTheDocument();
        expect(screen.getByText('Profit (€)')).toBeInTheDocument();
    });

    it('Set-Statistik tab filter narrows the set list', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        const filterInput = screen.getByLabelText('Set filtern');
        fireEvent.change(filterInput, { target: { value: 'Darkwing' } });
        expect(screen.getByText('Darkwing Blast')).toBeInTheDocument();
        expect(screen.queryByText('Phantom Rage')).not.toBeInTheDocument();
        expect(screen.queryByText('Legend of Blue Eyes')).not.toBeInTheDocument();
    });

    it('Set-Statistik tab filter is case-insensitive', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        const filterInput = screen.getByLabelText('Set filtern');
        fireEvent.change(filterInput, { target: { value: 'phantom' } });
        expect(screen.getByText('Phantom Rage')).toBeInTheDocument();
        expect(screen.queryByText('Darkwing Blast')).not.toBeInTheDocument();
    });

    it('Set-Statistik tab shows no data message when filter matches nothing', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        const filterInput = screen.getByLabelText('Set filtern');
        fireEvent.change(filterInput, { target: { value: 'zzznomatch' } });
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
    });

    it('Set-Statistik tab shows no data message when orders list is empty', () => {
        renderWithStore([]);
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
    });

    it('Set-Statistik aggregates Warenwert correctly for Darkwing Blast', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        // Darkwing Blast: 10.00 * 1 = 10
        expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('Set-Statistik tab shows Einkaufspreis for sets with a matching purchase invoice', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        // Darkwing Blast has a purchase invoice with price 7.50
        expect(screen.getByText('7.5')).toBeInTheDocument();
    });

    it('Set-Statistik tab calculates Profit correctly for sets with a purchase invoice', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        // Darkwing Blast: Warenwert 10 - Einkaufspreis 7.50 = 2.50
        expect(screen.getByText('2.5')).toBeInTheDocument();
    });

    it('Set-Statistik tab shows "-" for Einkaufspreis and Profit when no purchase invoice matches', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        // Phantom Rage and Legend of Blue Eyes have no matching invoices → "-"
        const dashes = screen.getAllByText('-');
        // 2 sets without invoices × 2 columns each = 4 dashes
        expect(dashes.length).toBe(4);
    });

    it('Set-Statistik tab shows "-" for both columns when no purchase invoices exist at all', () => {
        renderWithStore(mockOrders, []);
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        // All 3 sets without invoices → 6 dashes
        const dashes = screen.getAllByText('-');
        expect(dashes.length).toBe(6);
    });

    it('Set-Statistik tab shows negative profit when einkaufspreis exceeds Warenwert', () => {
        const invoicesWithHighPrice = [{ id: 2, productName: 'Darkwing Blast', amount: 1, price: 15.00, invoiceDate: '2024-01-10' }];
        renderWithStore(mockOrders, invoicesWithHighPrice);
        fireEvent.click(screen.getByRole('tab', { name: 'Set-Statistik' }));
        // Darkwing Blast: Warenwert 10 - Einkaufspreis 15 = -5
        expect(screen.getByText('-5')).toBeInTheDocument();
    });
});

