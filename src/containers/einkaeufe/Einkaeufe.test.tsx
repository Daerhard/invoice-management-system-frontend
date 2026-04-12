import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import Einkaeufe from './Einkaeufe';

jest.mock('../../api/hooks/useCardmarketOrders', () => () => {});
jest.mock('../../api/hooks/usePurchaseInvoices', () => () => {});
jest.mock('../../api/hooks/useRefunds', () => () => {});
jest.mock('../../api/hooks/useSupplies', () => () => {});
jest.mock('../../components/einkaeufe/AddPurchaseInvoiceDrawer', () => () => null);
jest.mock('../../components/einkaeufe/AddRefundDrawer', () => () => null);
jest.mock('../../components/einkaeufe/AddSupplyDrawer', () => () => null);
jest.mock('../../components/einkaeufe/PurchaseInvoiceItem', () => ({ purchaseInvoice }: { purchaseInvoice: { productName: string } }) => (
    <div data-testid="purchase-invoice-item">{purchaseInvoice.productName}</div>
));
jest.mock('../../components/einkaeufe/RefundItem', () => ({ refund }: { refund: { description: string } }) => (
    <div data-testid="refund-item">{refund.description}</div>
));
jest.mock('../../components/einkaeufe/SupplyItem', () => ({ supply }: { supply: { description: string } }) => (
    <div data-testid="supply-item">{supply.description}</div>
));

const renderWithProvider = () => {
    const store = createStore();
    return render(
        <Provider store={store}>
            <Einkaeufe />
        </Provider>
    );
};

describe('Einkaeufe', () => {
    it('renders the section header', () => {
        renderWithProvider();
        expect(screen.getByText('Ausgaben')).toBeInTheDocument();
    });

    it('renders the tabs', () => {
        renderWithProvider();
        expect(screen.getByRole('tab', { name: 'Einkäufe' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Erstattungen' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { name: 'Zusatzmittel' })).toBeInTheDocument();
    });

    it('renders the add button', () => {
        renderWithProvider();
        expect(screen.getByRole('button', { name: 'Neuen Einkauf erfassen' })).toBeInTheDocument();
    });

    it('shows empty state when no invoices', () => {
        renderWithProvider();
        expect(screen.getByText('Keine Einkäufe vorhanden.')).toBeInTheDocument();
    });
});
