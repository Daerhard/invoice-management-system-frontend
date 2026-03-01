import React, { useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import {
    cardmarketOrdersAtom,
    customerSelectAtom,
    cardmarketOrderSelectAtom,
    startDateSelectAtom,
    endDateSelectAtom,
    businessCustomerSelectAtom,
} from '../../store/Global';
import { CardmarketOrder } from '../../api/generated/Schemas';
import {
    Box,
    Grid2,
    IconButton,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterDrawer from '../../components/cardmarketOrders/filters/FilterDrawer';
import dayjs from 'dayjs';

function sumAndRound(values: number[]): number {
    const total = values.reduce((sum, value) => sum + value, 0);
    return Math.round(total * 100) / 100;
}

export default function Statistik() {
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom);
    const [customerSelect] = useAtom(customerSelectAtom);
    const [cardmarketOrderSelect] = useAtom(cardmarketOrderSelectAtom);
    const [startDateSelect] = useAtom(startDateSelectAtom);
    const [endDateSelect] = useAtom(endDateSelectAtom);
    const [onlyBusinessCustomers] = useAtom(businessCustomerSelectAtom);

    const [filteredOrders, setFilteredOrders] = useState<CardmarketOrder[]>([]);
    const [drawerOpen, setDrawerOpen] = useState(false);

    useEffect(() => {
        const filtered = cardmarketOrders
            .filter((order) => !customerSelect || order.customer.user_name === customerSelect.user_name)
            .filter((order) => !cardmarketOrderSelect || order.order_id === cardmarketOrderSelect?.order_id)
            .filter((order) => !startDateSelect || dayjs(order.payment_date) >= startDateSelect)
            .filter((order) => !endDateSelect || dayjs(order.payment_date) <= endDateSelect);

        setFilteredOrders(
            onlyBusinessCustomers
                ? filtered.filter((order) => order.customer.is_professional)
                : filtered
        );
    }, [cardmarketOrders, cardmarketOrderSelect, customerSelect, endDateSelect, startDateSelect, onlyBusinessCustomers]);

    const monthlyStats = useMemo(() => {
        const ordersByMonthMap = new Map<string, CardmarketOrder[]>();
        filteredOrders.forEach((order) => {
            const date = new Date(order.payment_date);
            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            if (!ordersByMonthMap.has(key)) {
                ordersByMonthMap.set(key, []);
            }
            ordersByMonthMap.get(key)!.push(order);
        });

        return Array.from(ordersByMonthMap.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([month, orders]) => ({
                month,
                totalValue: sumAndRound(orders.map((o) => o.total_value)),
                shipmentCost: sumAndRound(orders.map((o) => o.shipment_cost)),
                commission: sumAndRound(orders.map((o) => o.commission)),
                merchandiseValue: sumAndRound(orders.map((o) => o.merchandise_value)),
            }));
    }, [filteredOrders]);

    return (
        <Box style={{ width: '100%' }}>
            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Stack spacing={4} width="100%">
                <Grid2 container direction="row" justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="h6">Statistik</Typography>
                        <IconButton onClick={() => setDrawerOpen(true)} aria-label="Filter öffnen" size="small">
                            <FilterListIcon />
                        </IconButton>
                    </Stack>
                </Grid2>
                <TableContainer component={Paper}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Monat</strong></TableCell>
                                <TableCell align="right"><strong>Gesamtwert (€)</strong></TableCell>
                                <TableCell align="right"><strong>Versandkosten (€)</strong></TableCell>
                                <TableCell align="right"><strong>Cardmarket Gebühren (€)</strong></TableCell>
                                <TableCell align="right"><strong>Warenwert (€)</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {monthlyStats.length > 0 ? (
                                monthlyStats.map((stat) => (
                                    <TableRow key={stat.month}>
                                        <TableCell>{stat.month}</TableCell>
                                        <TableCell align="right">{stat.totalValue}</TableCell>
                                        <TableCell align="right">{stat.shipmentCost}</TableCell>
                                        <TableCell align="right">{stat.commission}</TableCell>
                                        <TableCell align="right">{stat.merchandiseValue}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5}>
                                        <Typography variant="body2" color="textSecondary">
                                            Keine Daten vorhanden.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Stack>
        </Box>
    );
}
