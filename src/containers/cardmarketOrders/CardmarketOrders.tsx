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

export default function CardmarketOrders(){
    const { data: orders} = useGenericRequest(
        'cardmarketOrders',
        () => getOrders()
    );

    return (
        <Box style={{ width: '100%' }}>
            <Stack sx={{ width: '100%' }}>
                <Stack direction="row">
                    <CardmarketOrderFilter></CardmarketOrderFilter>
                </Stack>
                <Typography>Bestellungen</Typography>
                <List dense={true} >
                    {orders !== undefined && orders?.data && orders.data.length > 0 ? (
                        orders.data.map((order) => (
                            <OrderItem key={order.order_id} order={order} />
                        ))
                    ) : (
                        <Typography variant="body2" color="textSecondary">
                            Keine Bestellungen verfügbar.
                        </Typography>
                    )}
                </List>
            </Stack>
        </Box>
    )
}