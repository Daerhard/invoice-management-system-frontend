import React from 'react';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Customers from './Customers';

jest.mock('../../api/generated/customers', () => ({
    __esModule: true,
    getProfessionalCustomers: jest.fn(),
    updateCustomerEmail: jest.fn(),
}));

const mockUseProfessionalCustomersQuery = jest.fn();
jest.mock('../../queries/useProfessionalCustomersQuery', () => ({
    __esModule: true,
    useProfessionalCustomersQuery: () => mockUseProfessionalCustomersQuery(),
    PROFESSIONAL_CUSTOMERS_QUERY_KEY: ['customers', 'professional'],
}));

jest.mock('../../queries/useUpdateCustomerEmailMutation', () => ({
    __esModule: true,
    useUpdateCustomerEmailMutation: () => ({ mutate: jest.fn(), isPending: false }),
}));

const renderWithProviders = () => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <Customers />
        </QueryClientProvider>
    );
};

describe('Customers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the Kunden heading', () => {
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: undefined });
        renderWithProviders();
        expect(screen.getByText('Kunden')).toBeInTheDocument();
    });

    it('shows a loading spinner while customers are being fetched', () => {
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: true, isError: false, data: undefined });
        renderWithProviders();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows an error banner when the request fails', () => {
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: true, data: undefined });
        renderWithProviders();
        expect(screen.getByText('Kundendaten konnten nicht geladen werden.')).toBeInTheDocument();
    });

    it('shows empty state message when loaded with no customers', () => {
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: [] } });
        renderWithProviders();
        expect(screen.getByText('Keine Kunden vorhanden.')).toBeInTheDocument();
    });

    it('renders a table row for each customer', () => {
        const customers = [
            { user_name: 'Alice', is_professional: true, email: 'alice@example.com' },
            { user_name: 'Bob', is_professional: true, email: null },
        ];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();
        expect(screen.getByText('Alice')).toBeInTheDocument();
        expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('displays existing email in the input field', () => {
        const customers = [{ user_name: 'Alice', is_professional: true, email: 'alice@example.com' }];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();
        expect(screen.getByDisplayValue('alice@example.com')).toBeInTheDocument();
    });

    it('shows the customer count chip when customers exist', () => {
        const customers = [{ user_name: 'Alice', is_professional: true, email: null }];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();
        expect(screen.getByText('1')).toBeInTheDocument();
    });
});
