import React from 'react'
import { renderHook, act } from '@testing-library/react'
import { Provider, createStore } from 'jotai'
import dayjs from 'dayjs'
import { useInvoiceFilters } from './useInvoiceFilters'

const createWrapper = () => {
    const store = createStore()
    return ({ children }: { children: React.ReactNode }) => (
        <Provider store={store}>{children}</Provider>
    )
}

describe('useInvoiceFilters', () => {
    it('initializes startDate to start of current year', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        expect(result.current.startDate.year()).toBe(dayjs().year())
        expect(result.current.startDate.month()).toBe(0)
        expect(result.current.startDate.date()).toBe(1)
    })

    it('initializes endDate to end of current year', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        expect(result.current.endDate.year()).toBe(dayjs().year())
        expect(result.current.endDate.month()).toBe(11)
        expect(result.current.endDate.date()).toBe(31)
    })

    it('setMonth updates the period to the given month within the current year', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        act(() => {
            result.current.setMonth(2) // March (0-indexed)
        })
        expect(result.current.startDate.month()).toBe(2)
        expect(result.current.startDate.year()).toBe(dayjs().year())
        expect(result.current.startDate.date()).toBe(1)
        expect(result.current.endDate.month()).toBe(2)
        expect(result.current.endDate.year()).toBe(dayjs().year())
    })

    it('setYear updates the period to the full year range', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        act(() => {
            result.current.setYear('2023')
        })
        expect(result.current.startDate.year()).toBe(2023)
        expect(result.current.startDate.month()).toBe(0) // January
        expect(result.current.startDate.date()).toBe(1)
        expect(result.current.endDate.year()).toBe(2023)
        expect(result.current.endDate.month()).toBe(11) // December
    })

    it('setMonth after setYear preserves the selected year', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        act(() => {
            result.current.setYear('2022')
        })
        act(() => {
            result.current.setMonth(5) // June
        })
        expect(result.current.startDate.year()).toBe(2022)
        expect(result.current.startDate.month()).toBe(5)
        expect(result.current.endDate.year()).toBe(2022)
        expect(result.current.endDate.month()).toBe(5)
    })

    it('setStartDate directly updates the startDate', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        const newDate = dayjs('2024-07-15')
        act(() => {
            result.current.setStartDate(newDate)
        })
        expect(result.current.startDate.year()).toBe(2024)
        expect(result.current.startDate.month()).toBe(6) // July
        expect(result.current.startDate.date()).toBe(15)
    })

    it('setEndDate directly updates the endDate', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        const newDate = dayjs('2024-09-30')
        act(() => {
            result.current.setEndDate(newDate)
        })
        expect(result.current.endDate.year()).toBe(2024)
        expect(result.current.endDate.month()).toBe(8) // September
        expect(result.current.endDate.date()).toBe(30)
    })

    it('rapid successive setMonth calls result in consistent state', () => {
        const { result } = renderHook(() => useInvoiceFilters(), { wrapper: createWrapper() })
        act(() => {
            result.current.setYear('2023')
        })
        act(() => {
            result.current.setMonth(0) // January
            result.current.setMonth(6) // July (last one wins)
        })
        expect(result.current.startDate.month()).toBe(6)
        expect(result.current.startDate.year()).toBe(2023)
        expect(result.current.endDate.month()).toBe(6)
        expect(result.current.endDate.year()).toBe(2023)
    })
})
