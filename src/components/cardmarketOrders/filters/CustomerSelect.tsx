import { Autocomplete, TextField, Tooltip } from '@mui/material'
import { customersAtom } from '../../../store/Global'
import { useAtom } from 'jotai'

export default function CustomerSelect() {
    const [customers] = useAtom(customersAtom);
    const customerNames = customers.map((customer) => customer.user_name) ?? []

    const customersAreEmpty = customerNames.length === 0

    return (
            <Tooltip
                title={customersAreEmpty ? 'Keine Kunden vorhanden' : ''}
                placement="bottom"
                arrow
            >
                <Autocomplete
                    sx={{ width: 200 }}
                    id='customer-select'
                    options={customerNames}
                    getOptionLabel={(option) => option}
                    disabled={customersAreEmpty}
                    renderInput={(params) =>
                        <TextField
                            {...params}
                            variant='standard'
                            label='Select Customer'/>
                    }
                />
            </Tooltip>
    )
}
