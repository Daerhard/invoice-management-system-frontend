import { Autocomplete, TextField, Tooltip } from '@mui/material'
import { customersAtom } from '../../../store/Global'
import { useAtom } from 'jotai'

type CustomerSelectProps = {
    onCustomerChange: (value: string | null) => void;
};

export default function CustomerSelect({ onCustomerChange }: CustomerSelectProps) {
    const [customers] = useAtom(customersAtom);
    const customerNames = customers.map((customer) => customer.user_name) ?? []
    const customersAreEmpty = customerNames.length === 0

    const handleCustomerChange = (_: unknown, value: string | null) => {
        onCustomerChange(value);
    };

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
                    onChange={handleCustomerChange}
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
