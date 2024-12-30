import React, { useEffect, useState } from 'react';
import { useGenericRequest } from '../../api/hooks/useGenericRequest';
import { getOrders } from '../../api/generated/orders';
import OrderItem from '../../components/cardmarketOrders/orderItem/OrderItem';
import { useAtom } from 'jotai';
import {
    customersAtom,
    cardmarketOrdersAtom,
    customerSelectAtom,
    cardmarketOrderSelectAtom,
    startDateSelectAtom, endDateSelectAtom,
} from '../../store/Global'
import { getAllCustomers } from '../../api/generated/customers';
import { CardmarketOrder } from '../../api/generated/Schemas'
import { Box, List, Stack, Typography } from '@mui/material'
import CustomerFilter from '../../components/cardmarketOrders/filters/CustomerFilter'
import CardmarketOrderFilter from '../../components/cardmarketOrders/filters/CardmarketOrderFilter'
import DateRangeFilter from '../../components/cardmarketOrders/filters/DateRangeFilter'
import CreatePDFInvoicesByDateRange from '../../components/cardmarketOrders/CreatePDFInvoicesByDateRange'
import dayjs from 'dayjs'

export default function CardmarketOrders() {
    const [cardmarketOrders, setCardmarketOrders] = useAtom(cardmarketOrdersAtom)
    const [,setCustomers] = useAtom(customersAtom)

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

    const [customerSelect] = useAtom(customerSelectAtom)
    const [cardmarketOrderSelect] = useAtom(cardmarketOrderSelectAtom)
    const [startDateSelect] = useAtom(startDateSelectAtom)
    const [endDateSelect] = useAtom(endDateSelectAtom)

    const [filteredCardmarketOrders, setFilteredCardmarketOrders] = useState<CardmarketOrder[]>(cardmarketOrders);

    useEffect(() => {
        const filteredOrders = cardmarketOrders
            .filter((order) => !customerSelect || order.customer.user_name === customerSelect.user_name)
            .filter((order) => !cardmarketOrderSelect || order.order_id === cardmarketOrderSelect?.order_id)
            .filter((order) => !startDateSelect || dayjs(order.payment_date) >= startDateSelect)
            .filter((order) => !endDateSelect || dayjs(order.payment_date) <= endDateSelect)

        setFilteredCardmarketOrders(filteredOrders)
    }, [cardmarketOrderSelect, cardmarketOrders, customerSelect, endDateSelect, startDateSelect]);

    return (
        <Box width="100%">
            <Stack spacing={4} width="100%">
                <Stack direction="row" spacing={4}>
                    <Stack spacing={2}>
                        <CustomerFilter/>
                        <CardmarketOrderFilter/>
                    </Stack>
                    <DateRangeFilter/>
                </Stack>
                <Box>
                    <Typography variant="h6">Bestellungen</Typography>
                    <List dense>
                        {filteredCardmarketOrders.length > 0 ? (
                            filteredCardmarketOrders.map((order) => (
                                <OrderItem key={order.order_id} cardmarketOrder={order} />
                            ))
                        ) : (
                            <Typography variant="body2" color="textSecondary">
                                Keine Bestellungen vorhanden.
                            </Typography>
                        )}
                    </List>
                </Box>
            </Stack>
        </Box>
    );
}
