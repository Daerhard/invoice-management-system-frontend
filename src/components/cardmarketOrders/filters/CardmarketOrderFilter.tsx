import { Autocomplete, TextField, Tooltip } from '@mui/material';
import { cardmarketOrdersAtom, cardmarketOrderSelectAtom, customerSelectAtom } from '../../../store/Global'
import { useAtom } from 'jotai';

export default function CardmarketOrderFilter() {
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)
    const [,setSelectedCardmarketOrder] = useAtom(cardmarketOrderSelectAtom)
    const [selectedCustomer] = useAtom(customerSelectAtom)
    const orderIds = selectedCustomer ? cardmarketOrders
            .filter((order) => order.customer.user_name === selectedCustomer.user_name)
            .map((order) => order.order_id?.toString() || '') : cardmarketOrders.map((order) => order.order_id?.toString() || '')
    const ordersAreEmpty = orderIds.length === 0

    const handleCardmarketOrderChange = (selectedCardmarketOrderId: string | null) => {
        const selectedCardmarketOrder = cardmarketOrders.find((order) => order.order_id?.toString() === selectedCardmarketOrderId)
        setSelectedCardmarketOrder(selectedCardmarketOrder || null)
    }

    return (
        <Tooltip
            title={ordersAreEmpty ? 'Keine Bestellungen vorhanden' : ''}
            placement="bottom"
            arrow
        >
            <Autocomplete
                sx={{ width: 200 }}
                options={orderIds}
                getOptionLabel={(option) => option}
                disabled={ordersAreEmpty}
                onChange={(_, newValue) => {
                    handleCardmarketOrderChange(newValue)
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="standard"
                        label="Filter nach Id"
                    />
                )}
            />
        </Tooltip>
    );
}
