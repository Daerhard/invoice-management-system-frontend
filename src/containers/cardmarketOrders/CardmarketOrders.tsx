import React, { useMemo, useState } from 'react';
import OrderItem from '../../components/cardmarketOrders/orderItem/OrderItem';
import { useAtom } from 'jotai';
import {
    cardmarketOrdersAtom,
    customerSelectAtom,
    cardmarketOrderSelectAtom,
    startDateSelectAtom, endDateSelectAtom, businessCustomerSelectAtom,
} from '../../store/Global'
import { Alert, Box, Button, Chip, CircularProgress, Divider, List, Pagination, Stack, Typography } from '@mui/material'
import FilterListIcon from '@mui/icons-material/FilterList'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import ListAltIcon from '@mui/icons-material/ListAlt'
import FilterDrawer from '../../components/cardmarketOrders/filters/FilterDrawer'
import ImportOrdersDrawer from '../../components/cardmarketOrders/ImportOrdersDrawer'
import dayjs from 'dayjs'
import useCustomers from '../../api/hooks/useCustomers'
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders'

export default function CardmarketOrders() {
    useCustomers()

    const { isLoading, isError } = useCardmarketOrders()

    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)
    const [customerSelect] = useAtom(customerSelectAtom)
    const [cardmarketOrderSelect] = useAtom(cardmarketOrderSelectAtom)
    const [startDateSelect] = useAtom(startDateSelectAtom)
    const [endDateSelect] = useAtom(endDateSelectAtom)
    const [onlyBusinessCustomers] = useAtom(businessCustomerSelectAtom)

    const filteredCardmarketOrders = useMemo(() => {
        const filtered = cardmarketOrders
            .filter((order) => !customerSelect || order.customer.user_name === customerSelect.user_name)
            .filter((order) => !cardmarketOrderSelect || order.order_id === cardmarketOrderSelect?.order_id)
            .filter((order) => !startDateSelect || dayjs(order.payment_date) >= startDateSelect)
            .filter((order) => !endDateSelect || dayjs(order.payment_date) <= endDateSelect);

        const result = onlyBusinessCustomers
            ? filtered.filter((order) => order.customer.is_professional)
            : filtered;

        return result.slice().sort((a, b) => dayjs(b.payment_date).diff(dayjs(a.payment_date)));
    }, [cardmarketOrders, cardmarketOrderSelect, customerSelect, endDateSelect, startDateSelect, onlyBusinessCustomers]);


    const [page, setPage] = useState(1)
    const itemsPerPage = 15
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [importDrawerOpen, setImportDrawerOpen] = useState(false)

    const handlePageChange = (value: number) => {
        setPage(value)
    }

    const paginatedOrders = filteredCardmarketOrders.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    )

    return (
        <Box style={{ width:'100%' }}>
            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <ImportOrdersDrawer open={importDrawerOpen} onClose={() => setImportDrawerOpen(false)} />
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <ListAltIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h5">Bestellungen</Typography>
                            {filteredCardmarketOrders.length > 0 && (
                                <Chip
                                    label={filteredCardmarketOrders.length}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600, borderRadius: 1 }}
                                />
                            )}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<FileUploadIcon />}
                                onClick={() => setImportDrawerOpen(true)}
                                aria-label="Import öffnen"
                            >
                                Import
                            </Button>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                startIcon={<FilterListIcon />}
                                onClick={() => setDrawerOpen(true)}
                                aria-label="Filter öffnen"
                            >
                                Filter
                            </Button>
                            <Pagination
                                count={Math.ceil(filteredCardmarketOrders.length / itemsPerPage)}
                                page={page}
                                onChange={(_, newValue) => handlePageChange(newValue)}
                                shape="rounded"
                                color="primary"
                            />
                        </Stack>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Übersicht aller Cardmarket-Bestellungen
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>
                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {isError && (
                            <Alert severity="error">
                                Bestellungen konnten nicht geladen werden.
                            </Alert>
                        )}
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
                    </>
                )}
            </Stack>
        </Box>
    );
}
