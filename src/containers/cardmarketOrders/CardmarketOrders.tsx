import {
    Box,
    List,
    Stack,
    Typography,
} from '@mui/material'
import { useGenericRequest } from '../../api/hooks/useGenericRequest'
import { getOrders } from '../../api/generated/orders'
import OrderItem from '../../components/cardmarketOrders/orderItem/OrderItem'
import CardmarketOrderFilter from './CardmarketOrderFilter'
import { useAtom } from 'jotai'
import { ordersAtom } from '../../store/Global'
import { useEffect } from 'react'

export default function CardmarketOrders(){
    const [orders, setOrders] = useAtom(ordersAtom);

    const { data: fetchedOrders } = useGenericRequest(
        'cardmarketOrders',
        () => getOrders()
    );

    useEffect(() => {
        if (fetchedOrders !== undefined && fetchedOrders.data.length > 0) {
            setOrders(fetchedOrders.data);
        }
    }, [fetchedOrders, setOrders]);

    return (
        <Box style={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }}>
                <Stack direction="row">
                    <CardmarketOrderFilter></CardmarketOrderFilter>
                </Stack>
                <Typography>Bestellungen</Typography>
                <List dense={true} >
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderItem key={order.order_id} order={order} />
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