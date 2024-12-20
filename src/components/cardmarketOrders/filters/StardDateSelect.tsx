import { useState } from 'react'
import dayjs, { Dayjs } from 'dayjs'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'

export default function StardDateSelect() {
    const today = new Date()
    const [value, setValue] = useState<Dayjs | null>(dayjs(today))

    return (
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    label="Startdatum"
                    value={value}
                    onChange={(newValue) => setValue(newValue)}
                />
            </LocalizationProvider>
    )
}