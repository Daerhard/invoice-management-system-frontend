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
import { Box, Chip, Divider, IconButton, List, Pagination, Stack, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import FilterDrawer from '../../components/cardmarketOrders/filters/FilterDrawer'
import dayjs from 'dayjs'
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders'
import useCustomers from '../../api/hooks/useCustomers'

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
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Typography variant="h5">Bestellungen</Typography>
                            {filteredCardmarketOrders && filteredCardmarketOrders.length > 0 && (
                                <Chip
                                    label={filteredCardmarketOrders.length}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600, borderRadius: 1 }}
                                />
                            )}
                            <IconButton
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Filter öffnen"
                                size="small"
                                sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}
                            >
                                <FilterListIcon />
                            </IconButton>
                        </Stack>
                        <Pagination
                            count={Math.ceil(filteredCardmarketOrders ? filteredCardmarketOrders.length / itemsPerPage : 0)}
                            page={page}
                            onChange={(_, newValue) => handlePageChange(newValue)}
                            shape="rounded"
                            color="primary"
                        />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Übersicht aller Cardmarket-Bestellungen
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>
                <List dense disablePadding>
                    {paginatedOrders.length > 0 ? (
                        paginatedOrders.map((order) => (
                            <OrderItem key={order.order_id} cardmarketOrder={order} />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Keine Bestellungen vorhanden.
                        </Typography>
                    )}
                </List>
            </Stack>
        </Box>
    );
}
