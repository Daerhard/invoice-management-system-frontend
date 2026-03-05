import { useAtom } from 'jotai'
import dayjs from 'dayjs'
import { startDateSelectAtom, endDateSelectAtom } from '../../store/Global'

export function useInvoiceFilters() {
    const [startDate, setStartDate] = useAtom(startDateSelectAtom)
    const [endDate, setEndDate] = useAtom(endDateSelectAtom)

    const setMonth = (monthIndex: number) => {
        const year = (startDate ?? dayjs()).year()
        setStartDate(dayjs().year(year).month(monthIndex).startOf('month'))
        setEndDate(dayjs().year(year).month(monthIndex).endOf('month'))
    }

    const setYear = (year: string) => {
        setStartDate(dayjs(year).startOf('year'))
        setEndDate(dayjs(year).endOf('year'))
    }

    const resetToDefault = () => {
        setStartDate(null)
        setEndDate(null)
    }

    return { startDate, endDate, setStartDate, setEndDate, setMonth, setYear, resetToDefault }
}
