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
    Button,
    Divider,
    Grid2,
    IconButton,
    Paper,
    Stack,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import BarChartIcon from '@mui/icons-material/BarChart';
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
    const [activeTab, setActiveTab] = useState(0);
    const [setFilter, setSetFilter] = useState('');

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

    const setStats = useMemo(() => {
        const setMap = new Map<string, number>();
        filteredOrders.forEach((order) => {
            const items = order.orderItems ?? [];
            items.forEach((item) => {
                const konamiSet = item.card.id.konamiSet;
                const itemMerch = item.price * item.count;
                setMap.set(konamiSet, (setMap.get(konamiSet) ?? 0) + itemMerch);
            });
        });
        return Array.from(setMap.entries())
            .map(([konamiSet, merchandiseValue]) => ({
                konamiSet,
                merchandiseValue: Math.round(merchandiseValue * 100) / 100,
            }))
            .sort((a, b) => a.konamiSet.localeCompare(b.konamiSet));
    }, [filteredOrders]);

    const filteredSetStats = useMemo(
        () =>
            setFilter.trim() === ''
                ? setStats
                : setStats.filter((s) =>
                      s.konamiSet.toLowerCase().includes(setFilter.trim().toLowerCase())
                  ),
        [setStats, setFilter]
    );

    return (
        <Box style={{ width: '100%' }}>
            <FilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <BarChartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h5">Statistik</Typography>
                        </Stack>
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
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Monatliche Umsatzübersicht nach Cardmarket-Bestellungen
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>
                <Tabs
                    value={activeTab}
                    onChange={(_e, val) => setActiveTab(val)}
                    aria-label="Statistik Tabs"
                    sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 40 }}
                >
                    <Tab label="Monatsübersicht" />
                    <Tab label="Set-Statistik" />
                </Tabs>
                {activeTab === 0 && (
                    <TableContainer component={Paper} elevation={0}>
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
                                            <Typography variant="body2" color="text.secondary">
                                                Keine Daten vorhanden.
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
                {activeTab === 1 && (
                    <Stack spacing={2}>
                        <TextField
                            label="Set filtern"
                            value={setFilter}
                            onChange={(e) => setSetFilter(e.target.value)}
                            size="small"
                            inputProps={{ 'aria-label': 'Set filtern' }}
                        />
                        <TableContainer component={Paper} elevation={0}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Set</strong></TableCell>
                                        <TableCell align="right"><strong>Warenwert (€)</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSetStats.length > 0 ? (
                                        filteredSetStats.map((s) => (
                                            <TableRow key={s.konamiSet}>
                                                <TableCell>{s.konamiSet}</TableCell>
                                                <TableCell align="right">{s.merchandiseValue}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={2}>
                                                <Typography variant="body2" color="text.secondary">
                                                    Keine Daten vorhanden.
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Stack>
                )}
            </Stack>
        </Box>
    );
}
