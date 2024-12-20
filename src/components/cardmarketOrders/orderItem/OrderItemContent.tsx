import { Box, Grid2, List, ListItem, ListItemText, Typography } from '@mui/material'
import { CardmarketOrder } from '../../../api/generated/Schemas'

interface OrderItemContentProps {
    cardmarketOrder: CardmarketOrder;
}

export default function OrderItemContent({ cardmarketOrder }: Readonly<OrderItemContentProps>) {
    const orderItems = cardmarketOrder.orderItems ?? []

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
                                ${item.price} ${cardmarketOrder.currency}`
                            }
                            />
                        </ListItem>
                    ))
                }
            </List>
            <Grid2 container spacing={6} sx={{ borderTop: '1px solid black' }}>
                <Grid2>
                    <Typography variant={'body2'}>Artikelanzahl: {cardmarketOrder.article_count}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Warenwert: {cardmarketOrder.merchandise_value} {cardmarketOrder.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Cardmarketgebühren: {cardmarketOrder.commission} {cardmarketOrder.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Versandgebühren: {cardmarketOrder.shipment_cost} {cardmarketOrder.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant={'body2'}>Gesamtpreis: {cardmarketOrder.total_value} {cardmarketOrder.currency}</Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}