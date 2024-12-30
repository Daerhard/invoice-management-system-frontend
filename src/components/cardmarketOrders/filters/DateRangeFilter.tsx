import React from 'react'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { TextField, Autocomplete, Stack } from '@mui/material';
import { useAtom } from 'jotai/index'
import { cardmarketOrdersAtom, endDateSelectAtom, startDateSelectAtom, } from '../../../store/Global'

export default function DateRangeFilter() {
    const [startDate, setStartDate] = useAtom(startDateSelectAtom)
    const [endDate, setEndDate] = useAtom(endDateSelectAtom)
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)

    const handleEndDateChange = (newEndDate: Dayjs) => {
       setEndDate(newEndDate)
    }

    const handleStartDateChange = (newStartDate: Dayjs) => {
        setStartDate(newStartDate)
    }

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
                            onChange={(date) => date ? handleStartDateChange(date) : startDate}
                            format="DD.MM.YYYY"
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
                            onChange={(date) => date ? handleEndDateChange(date) : endDate}
                            format="DD.MM.YYYY"
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
                            getOptionLabel={(option) => option.monthName}
                            onChange={(_, newValue) => {
                                if(newValue) {
                                    handleStartDateChange(dayjs().month(newValue.monthIndex).startOf('month'))
                                    handleEndDateChange(dayjs().month(newValue.monthIndex).endOf('month'))
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
                                    handleStartDateChange(dayjs(newValue).startOf('year'))
                                    handleEndDateChange(dayjs(newValue).endOf('year'))
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
