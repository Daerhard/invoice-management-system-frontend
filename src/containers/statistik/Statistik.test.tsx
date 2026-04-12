import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import { cardmarketOrdersAtom, purchaseInvoicesAtom, refundsAtom, suppliesAtom } from '../../store/Global';
import Statistik from './Statistik';

jest.mock('../../api/hooks/useCardmarketOrders', () => ({ __esModule: true, default: () => {} }));
jest.mock('../../api/hooks/usePurchaseInvoices', () => ({ __esModule: true, default: () => {} }));
jest.mock('../../api/hooks/useRefunds', () => ({ __esModule: true, default: () => {} }));
jest.mock('../../api/hooks/useSupplies', () => ({ __esModule: true, default: () => {} }));

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

const mockOrdersMultiYear = [
    ...mockOrders,
    {
        order_id: 1003,
        payment_date: '2025-03-05',
        total_value: 10.00,
        shipment_cost: 1.00,
        commission: 0.50,
        merchandise_value: 8.50,
        article_count: 1,
        currency: 'EUR',
        customer: { user_name: 'buyer3', is_professional: false },
        orderItems: [],
    },
];

const mockPurchaseInvoices = [
    { id: 1, productName: 'Darkwing Blast', amount: 1, price: 7.50, invoiceDate: '2024-01-10' },
];

const mockRefunds = [
    { id: 1, description: 'Rückerstattung Porto', amount: 5.00, date: '2024' },
    { id: 2, description: 'Rückerstattung Material', amount: 3.00, date: '2025' },
];

const mockSupplies = [
    { id: 1, description: 'Schutzhüllen', amount: 10.00, date: '2024-05-01' },
];

const renderWithStore = (
    orders = mockOrders,
    purchaseInvoices = mockPurchaseInvoices,
    refunds: typeof mockRefunds = [],
    supplies: typeof mockSupplies = [],
) => {
    const store = createStore();
    store.set(cardmarketOrdersAtom, orders as any);
    store.set(purchaseInvoicesAtom, purchaseInvoices as any);
    store.set(refundsAtom, refunds as any);
    store.set(suppliesAtom, supplies as any);
    return render(
        <Provider store={store}>
            <Statistik />
        </Provider>
    );
};

describe('Statistik', () => {
    it('renders all four tabs', () => {
        renderWithStore();
        const tabs = screen.getAllByRole('tab');
        expect(tabs[0]).toHaveTextContent('Profit Übersicht');
        expect(tabs[1]).toHaveTextContent('Monatsübersicht');
        expect(tabs[2]).toHaveTextContent('Jahresübersicht');
        expect(tabs[3]).toHaveTextContent('Set-Statistik');
    });

    it('shows Profit Übersicht tab by default with German chart titles', () => {
        renderWithStore();
        expect(screen.getByText(/Beste Konami Sets/)).toBeInTheDocument();
        expect(screen.getByText(/Schlechteste Konami Sets/)).toBeInTheDocument();
    });

    it('Profit Übersicht chart titles include Gesamtgewinn', () => {
        renderWithStore();
        expect(screen.getByText('Beste Konami Sets')).toBeInTheDocument();
        expect(screen.getByText('Schlechteste Konami Sets')).toBeInTheDocument();
        expect(screen.getAllByText(/Gesamtgewinn:/).length).toBeGreaterThanOrEqual(1);
    });

    it('Profit Übersicht shows Beste Konami Sets chart with data when profitable sets exist', () => {
        renderWithStore();
        // Darkwing Blast has profit 2.5 (> 0)
        expect(screen.getByRole('img', { name: 'Beste Konami Sets' })).toBeInTheDocument();
    });

    it('Profit Übersicht shows Schlechteste Konami Sets as disabled when no loss-making sets exist', () => {
        renderWithStore();
        // No sets with negative profit in mockData
        const noDataMessages = screen.getAllByText('Keine Daten vorhanden.');
        expect(noDataMessages.length).toBeGreaterThanOrEqual(1);
    });

    it('Profit Übersicht subtitle shows correct Gesamtgewinn for best sets', () => {
        renderWithStore();
        // Darkwing Blast: profit 2.5
        expect(screen.getByText('Gesamtgewinn: 2.50 €')).toBeInTheDocument();
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

    it('Profit Übersicht shows Schlechteste Konami Sets chart with data for loss-making sets', () => {
        const invoicesWithHighPrice = [
            { id: 1, productName: 'Darkwing Blast', amount: 1, price: 15.00, invoiceDate: '2024-01-10' },
        ];
        renderWithStore(mockOrders, invoicesWithHighPrice);
        // Darkwing Blast: profit = 10 - 15 = -5 (loss)
        expect(screen.getByRole('img', { name: 'Schlechteste Konami Sets' })).toBeInTheDocument();
        expect(screen.getByText('Gesamtgewinn: -5.00 €')).toBeInTheDocument();
    });

    it('does not show a FilterDrawer in Statistik', () => {
        renderWithStore();
        expect(screen.queryByTestId('filter-drawer')).not.toBeInTheDocument();
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

    it('Monatsübersicht tab shows a year filter with "Alle Jahre" as default', () => {
        renderWithStore();
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        expect(screen.getByText('Alle Jahre')).toBeInTheDocument();
    });

    it('year filter in Monatsübersicht shows months for selected year only when multiple years present', () => {
        renderWithStore(mockOrdersMultiYear);
        fireEvent.click(screen.getByRole('tab', { name: 'Monatsübersicht' }));
        // With "Alle Jahre" (default), both 2024 and 2025 months are shown
        expect(screen.getByText('2024-01')).toBeInTheDocument();
        expect(screen.getByText('2025-03')).toBeInTheDocument();
    });

    it('shows Jahresübersicht tab with yearly rows', () => {
        renderWithStore(mockOrders);
        fireEvent.click(screen.getByRole('tab', { name: 'Jahresübersicht' }));
        expect(screen.getByText('2024')).toBeInTheDocument();
    });

    it('Jahresübersicht shows Gesamt summary panel at top when data present', () => {
        renderWithStore(mockOrders);
        fireEvent.click(screen.getByRole('tab', { name: 'Jahresübersicht' }));
        expect(screen.getByText('Gesamt:')).toBeInTheDocument();
    });

    it('Jahresübersicht shows no data message when no orders, refunds, or supplies', () => {
        renderWithStore([]);
        fireEvent.click(screen.getByRole('tab', { name: 'Jahresübersicht' }));
        expect(screen.getByText('Keine Daten vorhanden.')).toBeInTheDocument();
    });

    it('Jahresübersicht shows Erstattungen column', () => {
        renderWithStore(mockOrders, mockPurchaseInvoices, mockRefunds);
        fireEvent.click(screen.getByRole('tab', { name: 'Jahresübersicht' }));
        expect(screen.getByText('Erstattungen (€)')).toBeInTheDocument();
    });

    it('Jahresübersicht shows Arbeitsmittel column', () => {
        renderWithStore(mockOrders, mockPurchaseInvoices, [], mockSupplies);
        fireEvent.click(screen.getByRole('tab', { name: 'Jahresübersicht' }));
        expect(screen.getByText('Arbeitsmittel (€)')).toBeInTheDocument();
    });

    it('Jahresübersicht aggregates refunds per year', () => {
        renderWithStore(mockOrders, mockPurchaseInvoices, mockRefunds);
        fireEvent.click(screen.getByRole('tab', { name: 'Jahresübersicht' }));
        // mockRefunds: 2024 → 5.00, 2025 → 3.00
        expect(screen.getByText('5')).toBeInTheDocument();
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
