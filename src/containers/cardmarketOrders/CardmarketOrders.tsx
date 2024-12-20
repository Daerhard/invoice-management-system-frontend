import {
    Box,
    List,
    Stack,
    Typography,
} from '@mui/material'
import { useGenericRequest } from '../../api/hooks/useGenericRequest'
import { getOrders } from '../../api/generated/orders'
import OrderItem from '../../components/cardmarketOrders/orderItem/OrderItem'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { customersAtom, cardmarketOrdersAtom } from '../../store/Global'
import { getAllCustomers } from '../../api/generated/customers'
import CustomerSelect from '../../components/cardmarketOrders/filters/CustomerSelect'
import StardDateSelect from '../../components/cardmarketOrders/filters/StardDateSelect'
import EndDateSelect from '../../components/cardmarketOrders/filters/EndDateSelect'
import { CardmarketOrder } from '../../api/generated/Schemas'

export default function CardmarketOrders(){
    const [cardmarketOrders, setCardmarketOrders] = useAtom(cardmarketOrdersAtom);
    const [, setCustomers] = useAtom(customersAtom);

    const { data: fetchedOrders } = useGenericRequest(
        'cardmarketOrders',
        () => getOrders()
    );

    useEffect(() => {
        if (fetchedOrders !== undefined && fetchedOrders.data.length > 0) {
            setCardmarketOrders(fetchedOrders.data);
        }
    }, [fetchedOrders, setCardmarketOrders]);

    const { data: fetchedCustomers } = useGenericRequest(
        'customers',
        () => getAllCustomers()
    );

    useEffect(() => {
        if (fetchedCustomers !== undefined && fetchedCustomers.data.length > 0) {
            setCustomers(fetchedCustomers.data);
        }
    }, [fetchedCustomers, setCustomers]);

    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

    const filterBySelectedCustomer = (orders: CardmarketOrder[], selectedCustomer: string | null) => {
        if (selectedCustomer) {
            return orders.filter((order) => order.customer.user_name === selectedCustomer);
        }
        return orders;
    };

    return (
        <Box style={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }}>
                <Box sx={{ width: '100%', marginBottom: '2rem' }}>
                    <Stack direction="row" spacing={4}>
                        <CustomerSelect onCustomerChange={(value) => setSelectedCustomer(value)}></CustomerSelect>
                        <StardDateSelect></StardDateSelect>
                        <EndDateSelect></EndDateSelect>
                    </Stack>
                </Box>
                <Typography>Bestellungen</Typography>
                <List dense={true} >
                    {cardmarketOrders.length > 0 ? (
                        filterBySelectedCustomer(cardmarketOrders, selectedCustomer)
                            .map((order) => (
                            <OrderItem key={order.order_id} cardmarketOrder={order} />
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Keine Bestellungen vorhanden.
                        </Typography>
                    )}
                </List>
            </Stack>
        </Box>
    )
}