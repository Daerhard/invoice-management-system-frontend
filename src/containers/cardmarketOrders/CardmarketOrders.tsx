import React, { useEffect, useState } from 'react';
import OrderItem from '../../components/cardmarketOrders/orderItem/OrderItem';
import { useAtom } from 'jotai';
import {
    cardmarketOrdersAtom,
    customerSelectAtom,
    cardmarketOrderSelectAtom,
    startDateSelectAtom, endDateSelectAtom, businessCustomerSelectAtom,
} from '../../store/Global'
import { CardmarketOrder } from '../../api/generated/Schemas'
import { Box, Grid2, IconButton, List, Pagination, Stack, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import CreateInvoicesPDFByDateRange from '../../components/invoices/CreateInvoicesPDFByDateRange'
import FilterDrawer from '../../components/cardmarketOrders/filters/FilterDrawer'
import dayjs from 'dayjs'
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders'
import useCustomers from '../../api/hooks/useCustomers'
import Statistic from '../../components/statistic/Statistic'

export default function CardmarketOrders() {
    useCardmarketOrders()
    useCustomers()

    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)
    const [customerSelect] = useAtom(customerSelectAtom)
    const [cardmarketOrderSelect] = useAtom(cardmarketOrderSelectAtom)
    const [startDateSelect] = useAtom(startDateSelectAtom)
    const [endDateSelect] = useAtom(endDateSelectAtom)
    const [onlyBusinessCustomers] = useAtom(businessCustomerSelectAtom)

    const [filteredCardmarketOrders, setFilteredCardmarketOrders] = useState<CardmarketOrder[]>();

    useEffect(() => {
        const filteredOrders = cardmarketOrders
            .filter((order) => !customerSelect || order.customer.user_name === customerSelect.user_name)
            .filter((order) => !cardmarketOrderSelect || order.order_id === cardmarketOrderSelect?.order_id)
            .filter((order) => !startDateSelect || dayjs(order.payment_date) >= startDateSelect)
            .filter((order) => !endDateSelect || dayjs(order.payment_date) <= endDateSelect);

        const finalFilteredOrders = onlyBusinessCustomers
            ? filteredOrders.filter((order) => order.customer.is_professional)
            : filteredOrders;

        setFilteredCardmarketOrders(finalFilteredOrders);
    }, [cardmarketOrders, cardmarketOrderSelect, customerSelect, endDateSelect, startDateSelect, onlyBusinessCustomers]);


    const [page, setPage] = useState(1)
    const itemsPerPage = 15
    const [drawerOpen, setDrawerOpen] = useState(false)

    const handlePageChange = (value: number) => {
        setPage(value)
    }

    const paginatedOrders = filteredCardmarketOrders ? filteredCardmarketOrders.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    ) : []

    return (
        <Box style={{ width:'100%' }}>
            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Stack spacing={4} width="100%">
                <List dense>
                    <Grid2 container direction='row' justifyContent='space-between' alignItems='center' marginBottom='0.5rem' >
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="h6">Bestellungen</Typography>
                            <IconButton onClick={() => setDrawerOpen(true)} aria-label="Filter öffnen" size="small">
                                <FilterListIcon />
                            </IconButton>
                        </Stack>
                        <Statistic cardmarketOrders={filteredCardmarketOrders || []} ></Statistic>
                        <CreateInvoicesPDFByDateRange/>
                        <Pagination
                            count={Math.ceil(filteredCardmarketOrders ? filteredCardmarketOrders.length / itemsPerPage : 0)}
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
