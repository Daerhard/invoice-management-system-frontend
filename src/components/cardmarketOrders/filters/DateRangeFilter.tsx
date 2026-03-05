import React, { useMemo } from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField, Autocomplete, Stack, Button } from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import { useAtom } from 'jotai/index'
import { cardmarketOrdersAtom } from '../../../store/Global'
import { getGermanMonthName } from '../../../helper/Utils'
import { useInvoiceFilters } from '../../../api/hooks/useInvoiceFilters'

export default function DateRangeFilter() {
    const { startDate, endDate, setStartDate, setEndDate, setMonth, setYear, resetToDefault } = useInvoiceFilters()
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)

    const firstOrderDate = useMemo(() => {
        if (cardmarketOrders.length === 0) return dayjs()
        const earliest = Math.min(...cardmarketOrders.map((o) => new Date(o.payment_date).getTime()))
        return dayjs(earliest).startOf('day')
    }, [cardmarketOrders])

    const effectiveStartDate = startDate ?? firstOrderDate
    const effectiveEndDate = endDate ?? dayjs().endOf('day')

    const months = Array.from({ length: 12 }, (_, i) => ({
        monthName: dayjs().month(i).format('MMMM'),
        monthIndex: i,
    }))
    const years = new Set(cardmarketOrders.map((order) => dayjs(order.payment_date).year().toString()))

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}>
                        <DatePicker
                            value={effectiveStartDate}
                            onChange={(date) => setStartDate(date)}
                            format="DD.MM.YYYY"
                            maxDate={effectiveEndDate}
                            slotProps={{
                                textField: {
                                    sx: { width: 200 },
                                    variant: 'standard',
                                    label: 'Startdatum',
                                },
                            }}
                        />
                        <DatePicker
                            value={effectiveEndDate}
                            onChange={(date) => setEndDate(date)}
                            format="DD.MM.YYYY"
                            minDate={effectiveStartDate}
                            slotProps={{
                                textField: {
                                    sx: { width: 200 },
                                    variant: 'standard',
                                    label: 'Enddatum',
                                },
                            }}
                        />
                </Stack>
                <Stack direction="row" spacing={2}>
                        <Autocomplete
                            options={months}
                            getOptionLabel={(option) => getGermanMonthName(option.monthIndex)}
                            onChange={(_, newValue) => {
                                if(newValue) {
                                    setMonth(newValue.monthIndex)
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ width: 200 }}
                                    variant="standard"
                                    label="Monat"
                                />
                            )}
                        />
                        <Autocomplete
                            options={Array.from(years)}
                            onChange={(_, newValue) => {
                                if(newValue) {
                                    setYear(newValue)
                                }
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    sx={{ width: 200 }}
                                    variant="standard"
                                    label="Jahr"
                                />
                            )}
                        />
                </Stack>
                <Button
                    variant="outlined"
                    size="small"
                    startIcon={<RestartAltIcon />}
                    onClick={resetToDefault}
                    aria-label="Filter zurücksetzen"
                    sx={{ alignSelf: 'flex-start' }}
                >
                    Zurücksetzen
                </Button>
            </Stack>
        </LocalizationProvider>
    );
}
