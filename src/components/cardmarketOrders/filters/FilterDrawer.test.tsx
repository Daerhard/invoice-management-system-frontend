import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import FilterDrawer from './FilterDrawer';

jest.mock('../../invoices/CreateInvoicesPDFByDateRange', () => () => <div data-testid="create-invoices-button" />);

const renderWithProvider = (ui: React.ReactElement) => {
    const store = createStore();
    return render(<Provider store={store}>{ui}</Provider>);
};

describe('FilterDrawer', () => {
    it('renders filter heading when open', () => {
        renderWithProvider(<FilterDrawer open={true} onClose={jest.fn()} />);
        expect(screen.getByText('Filter')).toBeInTheDocument();
    });

    it('does not show filter heading when closed', () => {
        renderWithProvider(<FilterDrawer open={false} onClose={jest.fn()} />);
        expect(screen.queryByText('Filter')).not.toBeInTheDocument();
    });

    it('calls onClose when the close button is clicked', () => {
        const onClose = jest.fn();
        renderWithProvider(<FilterDrawer open={true} onClose={onClose} />);
        fireEvent.click(screen.getByLabelText('Filter schließen'));
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('renders CustomerFilter inside the drawer when open', () => {
        renderWithProvider(<FilterDrawer open={true} onClose={jest.fn()} />);
        expect(screen.getByLabelText('Filter nach Kunde')).toBeInTheDocument();
    });

    it('renders BusinessCustomerFilter inside the drawer when open', () => {
        renderWithProvider(<FilterDrawer open={true} onClose={jest.fn()} />);
        expect(screen.getByText('nur gewerbliche Händler')).toBeInTheDocument();
    });

    it('renders CreateInvoicesPDFByDateRange inside the drawer when open', () => {
        renderWithProvider(<FilterDrawer open={true} onClose={jest.fn()} />);
        expect(screen.getByTestId('create-invoices-button')).toBeInTheDocument();
    });
});
