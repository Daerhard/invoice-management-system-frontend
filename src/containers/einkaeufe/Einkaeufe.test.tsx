import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider, createStore } from 'jotai';
import Einkaeufe from './Einkaeufe';

const renderWithProvider = () => {
    const store = createStore();
    return render(
        <Provider store={store}>
            <Einkaeufe />
        </Provider>
    );
};

describe('Einkaeufe', () => {
    it('renders the form with all required fields', () => {
        renderWithProvider();
        expect(screen.getByLabelText(/Produktname/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Anzahl Displays/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Preis/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Datum/)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Hinzufügen' })).toBeInTheDocument();
    });

    it('saves an Einkauf and shows it in the list', () => {
        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Produktname/), { target: { value: 'Supreme Darkness' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-22' } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        expect(screen.getByText('Supreme Darkness')).toBeInTheDocument();
        expect(screen.getByText('24')).toBeInTheDocument();
        expect(screen.getByText('1319.76')).toBeInTheDocument();
        expect(screen.getByText('22.01.2025')).toBeInTheDocument();
    });

    it('resets the form after submission', () => {
        renderWithProvider();

        const produktnameInput = screen.getByLabelText(/Produktname/) as HTMLInputElement;
        fireEvent.change(produktnameInput, { target: { value: 'Supreme Darkness' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '24' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '1319.76' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-22' } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        expect(produktnameInput.value).toBe('');
    });

    it('does not show the list when no Einkäufe have been added', () => {
        renderWithProvider();
        expect(screen.queryByText('Erfasste Einkäufe')).not.toBeInTheDocument();
    });

    it('shows the list heading once an Einkauf is added', () => {
        renderWithProvider();

        fireEvent.change(screen.getByLabelText(/Produktname/), { target: { value: 'Test Produkt' } });
        fireEvent.change(screen.getByLabelText(/Anzahl Displays/), { target: { value: '1' } });
        fireEvent.change(screen.getByLabelText(/Preis/), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/Datum/), { target: { value: '2025-01-01' } });

        fireEvent.click(screen.getByRole('button', { name: 'Hinzufügen' }));

        expect(screen.getByText('Erfasste Einkäufe')).toBeInTheDocument();
    });
});
