import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Konto from './Konto';

jest.mock('../../api/generated/users', () => ({
    __esModule: true,
    getAllUsers: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
}));

const mockUseUsersQuery = jest.fn();
jest.mock('../../queries/useUsersQuery', () => ({
    __esModule: true,
    useUsersQuery: () => mockUseUsersQuery(),
    USERS_QUERY_KEY: ['users'],
}));

const mockCreateMutate = jest.fn();
jest.mock('../../queries/useCreateUserMutation', () => ({
    __esModule: true,
    useCreateUserMutation: () => ({ mutate: mockCreateMutate, isPending: false }),
}));

const mockUpdateMutate = jest.fn();
jest.mock('../../queries/useUpdateUserMutation', () => ({
    __esModule: true,
    useUpdateUserMutation: () => ({ mutate: mockUpdateMutate, isPending: false }),
}));

const renderWithProviders = () => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>
            <Konto />
        </QueryClientProvider>
    );
};

describe('Konto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the Konto heading', () => {
        mockUseUsersQuery.mockReturnValue({ isLoading: false, isError: false, data: undefined });
        renderWithProviders();
        expect(screen.getByText('Konto')).toBeInTheDocument();
    });

    it('shows a loading spinner while users are being fetched', () => {
        mockUseUsersQuery.mockReturnValue({ isLoading: true, isError: false, data: undefined });
        renderWithProviders();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('shows an error banner when the request fails', () => {
        mockUseUsersQuery.mockReturnValue({ isLoading: false, isError: true, data: undefined });
        renderWithProviders();
        expect(screen.getByText('Benutzerdaten konnten nicht geladen werden.')).toBeInTheDocument();
    });

    it('shows create form when no user exists', () => {
        mockUseUsersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: [] } });
        renderWithProviders();
        expect(screen.getByText('Neuen Benutzer anlegen')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Benutzer anlegen/i })).toBeInTheDocument();
    });

    it('shows edit form when a user exists', () => {
        const user = {
            id: 1,
            username: 'testuser',
            firstName: 'Max',
            lastName: 'Mustermann',
            zipCode: '12345',
            city: 'Berlin',
            street: 'Musterstr. 1',
            email: 'max@example.com',
        };
        mockUseUsersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: [user] } });
        renderWithProviders();
        expect(screen.getByText('Benutzerdaten bearbeiten')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Speichern/i })).toBeInTheDocument();
        expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
        expect(screen.getByDisplayValue('max@example.com')).toBeInTheDocument();
    });

    it('id field is disabled', () => {
        const user = {
            id: 42,
            username: 'testuser',
            firstName: 'Max',
            lastName: 'Mustermann',
            zipCode: '12345',
            city: 'Berlin',
            street: 'Musterstr. 1',
            email: 'max@example.com',
        };
        mockUseUsersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: [user] } });
        renderWithProviders();
        const idField = screen.getByLabelText('Benutzer-ID');
        expect(idField).toBeDisabled();
    });

    it('calls createMutate when creating a new user', () => {
        mockUseUsersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: [] } });
        renderWithProviders();

        fireEvent.change(screen.getByLabelText('Benutzername'), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByLabelText('Vorname'), { target: { value: 'John' } });
        fireEvent.change(screen.getByLabelText('Nachname'), { target: { value: 'Doe' } });
        fireEvent.change(screen.getByLabelText('E-Mail'), { target: { value: 'john@example.com' } });
        fireEvent.change(screen.getByLabelText('Straße'), { target: { value: 'Main St 1' } });
        fireEvent.change(screen.getByLabelText('PLZ'), { target: { value: '10101' } });
        fireEvent.change(screen.getByLabelText('Stadt'), { target: { value: 'Berlin' } });

        fireEvent.click(screen.getByRole('button', { name: /Benutzer anlegen/i }));

        expect(mockCreateMutate).toHaveBeenCalledWith(
            expect.objectContaining({ username: 'newuser', firstName: 'John', lastName: 'Doe' }),
            expect.any(Object)
        );
    });

    it('calls updateMutate when updating an existing user', () => {
        const user = {
            id: 5,
            username: 'testuser',
            firstName: 'Max',
            lastName: 'Mustermann',
            zipCode: '12345',
            city: 'Berlin',
            street: 'Musterstr. 1',
            email: 'max@example.com',
        };
        mockUseUsersQuery.mockReturnValue({ isLoading: false, isError: false, data: { data: [user] } });
        renderWithProviders();

        fireEvent.change(screen.getByLabelText('E-Mail'), { target: { value: 'updated@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: /Speichern/i }));

        expect(mockUpdateMutate).toHaveBeenCalledWith(
            expect.objectContaining({ id: 5, user: expect.objectContaining({ email: 'updated@example.com' }) }),
            expect.any(Object)
        );
    });
});
