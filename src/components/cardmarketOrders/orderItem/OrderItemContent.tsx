import { Box, Grid2, List, ListItem, ListItemText, Typography } from '@mui/material'
import { CardmarketOrder } from '../../../api/generated/Schemas'

interface OrderItemContentProps {
    order: CardmarketOrder;
}

export default function OrderItemContent({ order }: OrderItemContentProps) {
    const orderItems = order.orderItems ?? []

    return (
        <Box>
            <Typography>Bestelldetails</Typography>
            <List dense={true}>
                {orderItems.length > 0 &&
                    orderItems.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={
                                `${item.count}x 
                                ${item.card.name} - 
                                (${item.card.id.konamiSet}) - 
                                ${item.card.id.number} -
                                ${item.card.rarity} -
                                ${item.price} ${order.currency}`
                            }
                            />
                        </ListItem>
                    ))
                }
            </List>
            <Grid2 container spacing={6} sx={{ borderTop: '1px solid black' }}>
                <Grid2>
                    <Typography variant={'body2'}>Artikelanzahl: {order.article_count}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Warenwert: {order.merchandise_value} {order.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Cardmarketgebühren: {order.commission} {order.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Versandgebühren: {order.shipment_cost} {order.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Gesamtpreis: {order.total_value} {order.currency}</Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}