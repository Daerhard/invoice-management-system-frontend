import { Autocomplete, TextField, Tooltip } from '@mui/material'
import { customersAtom, customerSelectAtom } from '../../../store/Global'
import { useAtom } from 'jotai'

export default function CustomerFilter() {
    const [customers] = useAtom(customersAtom)
    const [,setSelectedCustomer] = useAtom(customerSelectAtom)
    const customersAreEmpty = customers.length === 0

    const handleCustomerChange = (selectedCustomerName : string | null) => {
        const selectedCustomer = customers.find((customer) => customer.user_name === selectedCustomerName)
        setSelectedCustomer(selectedCustomer || null)
    }

    return (
        <Tooltip
            title={customersAreEmpty ? 'Keine Kunden vorhanden' : ''}
            placement="bottom"
            arrow
        >
            <Autocomplete
                sx={{ width: 200 }}
                options={customers.map((customer) => customer.user_name)}
                disabled={customersAreEmpty}
                onChange={(_, newValue) => {
                     handleCustomerChange(newValue)
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Filter nach Kunde"
                    />
                )}
            />
        </Tooltip>
    );
}
