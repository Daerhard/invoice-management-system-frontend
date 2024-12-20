import { Box, Stack } from '@mui/material'
import CustomerSelect from '../../components/cardmarketOrders/filters/CustomerSelect'
import { useGenericRequest } from '../../api/hooks/useGenericRequest'
import { getAllCustomers } from '../../api/generated/customers'
import { useAtom } from 'jotai'
import { customersAtom } from '../../store/Global'
import { useEffect } from 'react'
import StardDateSelect from '../../components/cardmarketOrders/filters/StardDateSelect'
import EndDateSelect from '../../components/cardmarketOrders/filters/EndDateSelect'

export default function CardmarketOrderFilter(){
    const [,setCustomers] = useAtom(customersAtom);

    const { data: fetchedCustomers } = useGenericRequest(
        'customers',
        () => getAllCustomers()
    );

    useEffect(() => {
        if (fetchedCustomers !== undefined && fetchedCustomers.data.length > 0) {
            setCustomers(fetchedCustomers.data);
        }
    }, [fetchedCustomers, setCustomers]);

    return (
        <Box sx={{ width: '100%', marginBottom: '2rem' }}>
            <Stack direction="row" spacing={4}>
                <CustomerSelect></CustomerSelect>
                <StardDateSelect></StardDateSelect>
                <EndDateSelect></EndDateSelect>
            </Stack>
        </Box>
    )
}