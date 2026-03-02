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
    Collapse,
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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
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
    const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());

    const toggleMonth = (month: string) => {
        setExpandedMonths((prev) => {
            const next = new Set(prev);
            if (next.has(month)) {
                next.delete(month);
            } else {
                next.add(month);
            }
            return next;
        });
    };

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
            .map(([month, orders]) => {
                const productMap = new Map<string, { totalValue: number; shipmentCost: number; merchandiseValue: number }>();

                orders.forEach((order) => {
                    const items = order.orderItems ?? [];
                    const itemsTotal = items.reduce((sum, item) => sum + item.price * item.count, 0);

                    items.forEach((item) => {
                        const productName = item.card.product_name;
                        const itemMerch = item.price * item.count;
                        const proportion = itemsTotal > 0 ? itemMerch / itemsTotal : 1 / items.length;
                        const itemShipment = order.shipment_cost * proportion;

                        if (!productMap.has(productName)) {
                            productMap.set(productName, { totalValue: 0, shipmentCost: 0, merchandiseValue: 0 });
                        }
                        const existing = productMap.get(productName)!;
                        existing.merchandiseValue += itemMerch;
                        existing.shipmentCost += itemShipment;
                        existing.totalValue += itemMerch + itemShipment;
                    });
                });

                const products = Array.from(productMap.entries()).map(([productName, values]) => ({
                    productName,
                    totalValue: Math.round(values.totalValue * 100) / 100,
                    shipmentCost: Math.round(values.shipmentCost * 100) / 100,
                    merchandiseValue: Math.round(values.merchandiseValue * 100) / 100,
                }));

                return {
                    month,
                    totalValue: sumAndRound(orders.map((o) => o.total_value)),
                    shipmentCost: sumAndRound(orders.map((o) => o.shipment_cost)),
                    commission: sumAndRound(orders.map((o) => o.commission)),
                    merchandiseValue: sumAndRound(orders.map((o) => o.merchandise_value)),
                    products,
                };
            });
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
                                    <React.Fragment key={stat.month}>
                                        <TableRow>
                                            <TableCell>
                                                <Stack direction="row" alignItems="center" spacing={0.5}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => toggleMonth(stat.month)}
                                                        aria-label={expandedMonths.has(stat.month) ? 'Einklappen' : 'Ausklappen'}
                                                    >
                                                        {expandedMonths.has(stat.month)
                                                            ? <KeyboardArrowUpIcon fontSize="small" />
                                                            : <KeyboardArrowDownIcon fontSize="small" />}
                                                    </IconButton>
                                                    {stat.month}
                                                </Stack>
                                            </TableCell>
                                            <TableCell align="right">{stat.totalValue}</TableCell>
                                            <TableCell align="right">{stat.shipmentCost}</TableCell>
                                            <TableCell align="right">{stat.commission}</TableCell>
                                            <TableCell align="right">{stat.merchandiseValue}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ py: 0 }}>
                                                <Collapse in={expandedMonths.has(stat.month)} timeout="auto" unmountOnExit>
                                                    <Box sx={{ margin: 1 }}>
                                                        <Table size="small">
                                                            <TableHead>
                                                                <TableRow>
                                                                    <TableCell><strong>Produkt</strong></TableCell>
                                                                    <TableCell align="right"><strong>Gesamtwert (€)</strong></TableCell>
                                                                    <TableCell align="right"><strong>Versandkosten (€)</strong></TableCell>
                                                                    <TableCell align="right"><strong>Warenwert (€)</strong></TableCell>
                                                                </TableRow>
                                                            </TableHead>
                                                            <TableBody>
                                                                {stat.products.length > 0 ? (
                                                                    stat.products.map((product, index) => (
                                                                        <TableRow key={`${product.productName}-${index}`}>
                                                                            <TableCell>{product.productName}</TableCell>
                                                                            <TableCell align="right">{product.totalValue}</TableCell>
                                                                            <TableCell align="right">{product.shipmentCost}</TableCell>
                                                                            <TableCell align="right">{product.merchandiseValue}</TableCell>
                                                                        </TableRow>
                                                                    ))
                                                                ) : (
                                                                    <TableRow>
                                                                        <TableCell colSpan={4}>
                                                                            <Typography variant="body2" color="textSecondary">
                                                                                Keine Produktdaten vorhanden.
                                                                            </Typography>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </Box>
                                                </Collapse>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
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
