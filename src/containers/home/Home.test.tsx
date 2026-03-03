import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import Home from './Home'

jest.mock('../../api/hooks/useCardmarketOrders', () => () => {})

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}))

const renderWithProviders = () => {
    const store = createStore()
    return render(
        <Provider store={store}>
            <Home />
        </Provider>
    )
}

describe('Home', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
    })

    it('renders the welcome title', () => {
        renderWithProviders()
        expect(screen.getByText('Willkommen bei InvoiceMS')).toBeInTheDocument()
    })

    it('renders a subtitle description', () => {
        renderWithProviders()
        expect(screen.getByText('Wählen Sie einen Bereich aus, um zu beginnen.')).toBeInTheDocument()
    })

    it('renders cards for all four sections', () => {
        renderWithProviders()
        expect(screen.getByText('Bestellungen')).toBeInTheDocument()
        expect(screen.getByText('Einkäufe')).toBeInTheDocument()
        expect(screen.getByText('Statistik')).toBeInTheDocument()
        expect(screen.getByText('Import')).toBeInTheDocument()
    })

    it('navigates to /bestellungen when Bestellungen card is clicked', () => {
        renderWithProviders()
        fireEvent.click(screen.getByText('Bestellungen'))
        expect(mockNavigate).toHaveBeenCalledWith('/bestellungen')
    })

    it('navigates to /einkaeufe when Einkäufe card is clicked', () => {
        renderWithProviders()
        fireEvent.click(screen.getByText('Einkäufe'))
        expect(mockNavigate).toHaveBeenCalledWith('/einkaeufe')
    })

    it('navigates to /statistik when Statistik card is clicked', () => {
        renderWithProviders()
        fireEvent.click(screen.getByText('Statistik'))
        expect(mockNavigate).toHaveBeenCalledWith('/statistik')
    })

    it('navigates to /import when Import card is clicked', () => {
        renderWithProviders()
        fireEvent.click(screen.getByText('Import'))
        expect(mockNavigate).toHaveBeenCalledWith('/import')
    })
})

