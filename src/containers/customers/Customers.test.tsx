import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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

const mockMutate = jest.fn();
jest.mock('../../queries/useUpdateCustomerEmailMutation', () => ({
    __esModule: true,
    useUpdateCustomerEmailMutation: () => ({ mutate: mockMutate, isPending: false }),
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

    it('renders new column headers in the table', () => {
        const customers = [{ user_name: 'Alice', is_professional: true, email: null }];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();
        expect(screen.getByText('Benutzername')).toBeInTheDocument();
        expect(screen.getByText('Professionell')).toBeInTheDocument();
        expect(screen.getByText('E-Mail')).toBeInTheDocument();
        expect(screen.queryByText('Straße')).not.toBeInTheDocument();
        expect(screen.queryByText('Stadt')).not.toBeInTheDocument();
        expect(screen.queryByText('Land')).not.toBeInTheDocument();
        expect(screen.queryByText('USt-IdNr.')).not.toBeInTheDocument();
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

    it('does not show the confirm icon button when email is unchanged', () => {
        const customers = [{ user_name: 'Alice', is_professional: true, email: 'alice@example.com' }];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();
        expect(screen.queryByRole('button', { name: /E-Mail für Alice speichern/i })).not.toBeInTheDocument();
    });

    it('shows the confirm icon button when email is changed to a valid value', () => {
        const customers = [{ user_name: 'Alice', is_professional: true, email: 'alice@example.com' }];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();

        const input = screen.getByLabelText('E-Mail für Alice');
        fireEvent.change(input, { target: { value: 'newalice@example.com' } });

        expect(screen.getByRole('button', { name: /E-Mail für Alice speichern/i })).toBeInTheDocument();
    });

    it('does not show the confirm button when email is changed to an invalid value', () => {
        const customers = [{ user_name: 'Alice', is_professional: true, email: 'alice@example.com' }];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();

        const input = screen.getByLabelText('E-Mail für Alice');
        fireEvent.change(input, { target: { value: 'not-an-email' } });

        expect(screen.queryByRole('button', { name: /E-Mail für Alice speichern/i })).not.toBeInTheDocument();
    });

    it('calls mutate when the confirm icon button is clicked', () => {
        const customers = [{ user_name: 'Alice', is_professional: true, email: 'alice@example.com' }];
        mockUseProfessionalCustomersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: customers } });
        renderWithProviders();

        const input = screen.getByLabelText('E-Mail für Alice');
        fireEvent.change(input, { target: { value: 'newalice@example.com' } });

        fireEvent.click(screen.getByRole('button', { name: /E-Mail für Alice speichern/i }));

        expect(mockMutate).toHaveBeenCalledWith(
            { userName: 'Alice', email: 'newalice@example.com' },
            expect.any(Object)
        );
    });
});

