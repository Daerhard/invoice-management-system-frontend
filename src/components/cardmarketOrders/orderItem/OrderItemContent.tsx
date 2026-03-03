import { Box, Divider, Grid2, List, ListItem, ListItemText, Typography } from '@mui/material'
import { CardmarketOrder } from '../../../api/generated/Schemas'

interface OrderItemContentProps {
    cardmarketOrder: CardmarketOrder
}

export default function OrderItemContent({ cardmarketOrder }: Readonly<OrderItemContentProps>) {
    const orderItems = cardmarketOrder.orderItems ?? []

    return (
        <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>Bestelldetails</Typography>
            <List dense={true} disablePadding>
                {orderItems.length > 0 &&
                    orderItems.map((item, index) => (
                        <ListItem key={index} disableGutters sx={{ py: 0.25 }}>
                            <ListItemText
                                primary={
                                    `${item.count}x 
                                ${item.card.name} - 
                                (${item.card.id.konamiSet}) - 
                                ${item.card.id.number} -
                                ${item.card.rarity} -
                                ${item.price} ${cardmarketOrder.currency}`
                                }
                                primaryTypographyProps={{ variant: 'body2' }}
                            />
                        </ListItem>
                    ))
                }
            </List>
            <Divider sx={{ my: 1.5 }} />
            <Grid2 container spacing={4}>
                <Grid2>
                    <Typography variant="body2" color="text.secondary">Artikelanzahl</Typography>
                    <Typography variant="body2" fontWeight={600}>{cardmarketOrder.article_count}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant="body2" color="text.secondary">Warenwert</Typography>
                    <Typography variant="body2" fontWeight={600}>{cardmarketOrder.merchandise_value} {cardmarketOrder.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant="body2" color="text.secondary">Cardmarketgebühren</Typography>
                    <Typography variant="body2" fontWeight={600}>{cardmarketOrder.commission} {cardmarketOrder.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant="body2" color="text.secondary">Versandgebühren</Typography>
                    <Typography variant="body2" fontWeight={600}>{cardmarketOrder.shipment_cost} {cardmarketOrder.currency}</Typography>
                </Grid2>
                <Grid2>
                    <Typography variant="body2" color="text.secondary">Gesamtpreis</Typography>
                    <Typography variant="body2" fontWeight={600} color="primary.main">{cardmarketOrder.total_value} {cardmarketOrder.currency}</Typography>
                </Grid2>
            </Grid2>
        </Box>
    )
}