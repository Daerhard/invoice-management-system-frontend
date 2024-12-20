import { Box } from '@mui/material'
import OrderCustomerSelect from '../../components/cardmarketOrders/filters/OrderCustomerSelect'
import { useGenericRequest } from '../../api/hooks/useGenericRequest'
import { getAllCustomers } from '../../api/generated/customers'


export default function CardmarketOrderFilter(){
    const { data: customers } = useGenericRequest(
        'customers',
        () => getAllCustomers()
    );

    return (
        <Box sx={{ width: '100%', marginBottom: '2rem' }}>
            <OrderCustomerSelect customers={customers?.data ?? []}></OrderCustomerSelect>


        </Box>
    )
}