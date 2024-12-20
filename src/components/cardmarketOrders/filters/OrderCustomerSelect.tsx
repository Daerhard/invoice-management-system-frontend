import { Autocomplete, TextField, Tooltip } from '@mui/material'
import { Customer } from '../../../api/generated/Schemas'

interface CustomerSelectProps {
    customers: Customer[];
}

export default function OrderCustomerSelect({ customers }: CustomerSelectProps) {
    const customerNames = customers.map((customer) => customer.user_name) ?? []

    const customersAreEmpty = customerNames.length === 0

    return (
            <Tooltip
                title={customersAreEmpty ? 'No customers available' : ''}
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
