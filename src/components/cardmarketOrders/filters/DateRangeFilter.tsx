import React from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { TextField, Autocomplete, Stack } from '@mui/material';
import { useAtom } from 'jotai/index'
import { cardmarketOrdersAtom } from '../../../store/Global'
import { getGermanMonthName } from '../../../helper/Utils'
import { useInvoiceFilters } from '../../../api/hooks/useInvoiceFilters'

export default function DateRangeFilter() {
    const { startDate, endDate, setStartDate, setEndDate, setMonth, setYear } = useInvoiceFilters()
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)

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
                            value={startDate}
                            onChange={(date) => date ? setStartDate(date) : startDate}
                            format="DD.MM.YYYY"
                            maxDate={endDate}
                            slotProps={{
                                textField: {
                                    sx: { width: 200 },
                                    variant: 'standard',
                                    label: 'Startdatum',
                                },
                            }}
                        />
                        <DatePicker
                            value={endDate}
                            onChange={(date) => date ? setEndDate(date) : endDate}
                            format="DD.MM.YYYY"
                            minDate={startDate}
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
            </Stack>
        </LocalizationProvider>
    );
}
