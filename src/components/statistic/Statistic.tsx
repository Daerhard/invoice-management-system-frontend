import { List, ListItem, ListItemText, Tooltip, Typography } from '@mui/material'
import { CardmarketOrder } from '../../api/generated/Schemas'


interface StatisticProps {
    cardmarketOrders: CardmarketOrder[]
}

export default function Statistic({cardmarketOrders}: StatisticProps) {

    function sumAndRound(values: number[]): number {
        const totalValue = values.reduce((sum, value) => sum + value, 0);

        return Math.round(totalValue * 100) / 100;
    }

    const ordersTotalValues = sumAndRound(cardmarketOrders.map((order) => order.total_value))
    const ordersShipmentCosts = sumAndRound(cardmarketOrders.map((order) => order.shipment_cost))
    const ordersComissions = sumAndRound(cardmarketOrders.map((order) => order.commission))
    const ordersMerchandiseValues = sumAndRound(cardmarketOrders.map((order) => order.merchandise_value))


    return (
        <div>
            <Tooltip
                title={
                    <List>
                        <ListItem>
                            <ListItemText primary="Bestellungen Gesamtwert:" secondary={ordersTotalValues}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Bestellungen Versandkosten gesamt:" secondary={ordersShipmentCosts}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Bestellungen Cardmarket Gebühren gesamt:" secondary={ordersComissions}/>
                        </ListItem>
                        <ListItem>
                            <ListItemText primary="Bestellungen:" secondary={ordersMerchandiseValues}/>
                        </ListItem>
                    </List>
                }
                arrow
                placement="bottom"
            >
                <Typography variant="h6" style={{ cursor: "pointer" }}>
                    Statistik
                </Typography>
            </Tooltip>
        </div>
    )
}