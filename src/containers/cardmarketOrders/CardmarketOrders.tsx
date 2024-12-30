import React, { useEffect, useState } from 'react';
import OrderItem from '../../components/cardmarketOrders/orderItem/OrderItem';
import { useAtom } from 'jotai';
import {
    cardmarketOrdersAtom,
    customerSelectAtom,
    cardmarketOrderSelectAtom,
    startDateSelectAtom, endDateSelectAtom,
} from '../../store/Global'
import { CardmarketOrder } from '../../api/generated/Schemas'
import { Box, Grid, Grid2, List, Pagination, Stack, Typography } from '@mui/material'
import CustomerFilter from '../../components/cardmarketOrders/filters/CustomerFilter'
import CardmarketOrderFilter from '../../components/cardmarketOrders/filters/CardmarketOrderFilter'
import DateRangeFilter from '../../components/cardmarketOrders/filters/DateRangeFilter'
import CreatePDFInvoicesByDateRange from '../../components/cardmarketOrders/CreatePDFInvoicesByDateRange'
import dayjs from 'dayjs'
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders'
import useCustomers from '../../api/hooks/useCustomers'

export default function CardmarketOrders() {
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)
    useCardmarketOrders()
    useCustomers()

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

    const [page, setPage] = useState(1)
    const itemsPerPage = 15

    const handlePageChange = (value: number) => {
        setPage(value)
    }

    const paginatedOrders = filteredCardmarketOrders.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    )

    return (
        <Box style={{ width:'100%' }}>
            <Stack spacing={4} width="100%">
                <Stack direction="row" spacing={4}>
                    <Stack spacing={2}>
                        <CustomerFilter/>
                        <CardmarketOrderFilter/>
                    </Stack>
                    <DateRangeFilter/>
                    <CreatePDFInvoicesByDateRange/>
                </Stack>
                    <List dense>
                        <Grid2 container direction='row' justifyContent='space-between' marginBottom='0.5rem' >
                            <Typography variant="h6">Bestellungen</Typography>
                            <Pagination
                                count={Math.ceil(filteredCardmarketOrders.length / itemsPerPage)}
                                page={page}
                                onChange={(_, newValue) => handlePageChange(newValue)}
                                shape="rounded"
                            />
                        </Grid2>
                        {paginatedOrders.length > 0 ? (
                            paginatedOrders.map((order) => (
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
    );
}
