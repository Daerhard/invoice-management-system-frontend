import React, { useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import {
    cardmarketOrdersAtom,
    purchaseInvoicesAtom,
    refundsAtom,
    suppliesAtom,
} from '../../store/Global';
import { CardmarketOrder } from '../../api/generated/Schemas';
import {
    Box,
    Divider,
    MenuItem,
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
import BarChartIcon from '@mui/icons-material/BarChart';
import ProfitPieChart from '../../components/statistic/ProfitPieChart';
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders';
import usePurchaseInvoices from '../../api/hooks/usePurchaseInvoices';
import useRefunds from '../../api/hooks/useRefunds';
import useSupplies from '../../api/hooks/useSupplies';

const PROFIT_CHART_LIMIT = 5;

function sumAndRound(values: number[]): number {
    const total = values.reduce((sum, value) => sum + value, 0);
    return Math.round(total * 100) / 100;
}

export default function Statistik() {
    useCardmarketOrders();
    usePurchaseInvoices();
    useRefunds();
    useSupplies();

    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom);
    const [purchaseInvoices] = useAtom(purchaseInvoicesAtom);
    const [refunds] = useAtom(refundsAtom);
    const [supplies] = useAtom(suppliesAtom);

    const [activeTab, setActiveTab] = useState(0);
    const [setFilter, setSetFilter] = useState('');
    const [selectedYear, setSelectedYear] = useState<number | 'all'>('all');

    const monthlyStats = useMemo(() => {
        const ordersByMonthMap = new Map<string, CardmarketOrder[]>();
        cardmarketOrders.forEach((order) => {
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
    }, [cardmarketOrders]);

    const availableYears = useMemo(() => {
        const years = new Set<number>();
        cardmarketOrders.forEach((o) => years.add(new Date(o.payment_date).getFullYear()));
        return Array.from(years).sort((a, b) => b - a);
    }, [cardmarketOrders]);

    const filteredMonthlyStats = useMemo(
        () =>
            selectedYear === 'all'
                ? monthlyStats
                : monthlyStats.filter((s) => s.month.startsWith(String(selectedYear))),
        [monthlyStats, selectedYear]
    );

    const filteredMonthlyTotals = useMemo(() => ({
        totalValue: sumAndRound(filteredMonthlyStats.map((s) => s.totalValue)),
        shipmentCost: sumAndRound(filteredMonthlyStats.map((s) => s.shipmentCost)),
        commission: sumAndRound(filteredMonthlyStats.map((s) => s.commission)),
        merchandiseValue: sumAndRound(filteredMonthlyStats.map((s) => s.merchandiseValue)),
    }), [filteredMonthlyStats]);

    const purchaseMap = useMemo(() => {
        const map = new Map<string, number>();
        purchaseInvoices.forEach((invoice) => {
            const key = invoice.productName.toLowerCase();
            map.set(key, (map.get(key) ?? 0) + (invoice.totalPrice ?? 0));
        });
        return map;
    }, [purchaseInvoices]);

    const setStats = useMemo(() => {
        const setMap = new Map<string, number>();
        cardmarketOrders.forEach((order) => {
            const items = order.orderItems ?? [];
            items.forEach((item) => {
                const konamiSet = item.card.id.konamiSet;
                const itemMerch = item.price * item.count;
                setMap.set(konamiSet, (setMap.get(konamiSet) ?? 0) + itemMerch);
            });
        });
        return Array.from(setMap.entries())
            .map(([konamiSet, merchandiseValue]) => {
                const roundedMerch = Math.round(merchandiseValue * 100) / 100;
                const rawEinkauf = purchaseMap.get(konamiSet.toLowerCase());
                const einkaufspreis = rawEinkauf !== undefined ? Math.round(rawEinkauf * 100) / 100 : null;
                const profit = einkaufspreis !== null ? Math.round((roundedMerch - einkaufspreis) * 100) / 100 : null;
                return {
                    konamiSet,
                    merchandiseValue: roundedMerch,
                    einkaufspreis,
                    profit,
                };
            })
            .sort((a, b) => a.konamiSet.localeCompare(b.konamiSet));
    }, [cardmarketOrders, purchaseMap]);

    const filteredSetStats = useMemo(
        () =>
            setFilter.trim() === ''
                ? setStats
                : setStats.filter((s) =>
                      s.konamiSet.toLowerCase().includes(setFilter.trim().toLowerCase())
                  ),
        [setStats, setFilter]
    );

    const setsWithKnownProfit = useMemo(
        () => setStats.filter((s): s is typeof setStats[0] & { profit: number } => s.profit !== null),
        [setStats]
    );

    const bestSets = useMemo(
        () =>
            setsWithKnownProfit
                .filter((s) => s.profit > 0)
                .sort((a, b) => b.profit - a.profit)
                .slice(0, PROFIT_CHART_LIMIT),
        [setsWithKnownProfit]
    );

    const worstSets = useMemo(
        () =>
            setsWithKnownProfit
                .filter((s) => s.profit < 0)
                .sort((a, b) => a.profit - b.profit)
                .slice(0, PROFIT_CHART_LIMIT),
        [setsWithKnownProfit]
    );

    const bestSetsTotal = useMemo(
        () => Math.round(bestSets.reduce((sum, s) => sum + s.profit, 0) * 100) / 100,
        [bestSets]
    );

    const worstSetsTotal = useMemo(
        () => Math.round(worstSets.reduce((sum, s) => sum + s.profit, 0) * 100) / 100,
        [worstSets]
    );

    const purchasesByYear = useMemo(() => {
        const map = new Map<string, number>();
        purchaseInvoices.forEach((invoice) => {
            invoice.items?.forEach((item) => {
                const year = typeof item.invoiceDate === 'string' ? item.invoiceDate.slice(0, 4) : undefined;
                if (year) {
                    const itemTotal = (item.amount ?? 0) * (item.price ?? 0);
                    map.set(year, (map.get(year) ?? 0) + itemTotal);
                }
            });
        });
        return map;
    }, [purchaseInvoices]);

    // Jahresübersicht: yearly aggregation including refunds, supplies and purchase invoices
    const yearlyStats = useMemo(() => {
        const ordersByYearMap = new Map<string, CardmarketOrder[]>();
        cardmarketOrders.forEach((order) => {
            const year = String(new Date(order.payment_date).getFullYear());
            if (!ordersByYearMap.has(year)) {
                ordersByYearMap.set(year, []);
            }
            ordersByYearMap.get(year)!.push(order);
        });

        const refundsByYear = new Map<string, number>();
        refunds.forEach((r) => {
            const year = r.date.slice(0, 4);
            refundsByYear.set(year, (refundsByYear.get(year) ?? 0) + r.amount);
        });

        const suppliesByYear = new Map<string, number>();
        supplies.forEach((s) => {
            const year = s.date.slice(0, 4);
            suppliesByYear.set(year, (suppliesByYear.get(year) ?? 0) + s.amount);
        });

        // Collect all years from orders, refunds, supplies and purchase invoices
        const allYears = new Set<string>([
            ...Array.from(ordersByYearMap.keys()),
            ...Array.from(refundsByYear.keys()),
            ...Array.from(suppliesByYear.keys()),
            ...Array.from(purchasesByYear.keys()),
        ]);

        return Array.from(allYears)
            .sort((a, b) => a.localeCompare(b))
            .map((year) => {
                const orders = ordersByYearMap.get(year) ?? [];
                const totalValue = sumAndRound(orders.map((o) => o.total_value));
                const shipmentCost = sumAndRound(orders.map((o) => o.shipment_cost));
                const commission = sumAndRound(orders.map((o) => o.commission));
                const merchandiseValue = sumAndRound(orders.map((o) => o.merchandise_value));
                const erstattungen = Math.round((refundsByYear.get(year) ?? 0) * 100) / 100;
                const arbeitsmittel = Math.round((suppliesByYear.get(year) ?? 0) * 100) / 100;
                const einkaeufe = Math.round((purchasesByYear.get(year) ?? 0) * 100) / 100;
                const nachzahlungen = 0; // placeholder – no backend endpoint yet
                const gewinn = Math.round(
                    (totalValue + nachzahlungen - shipmentCost - commission - merchandiseValue - erstattungen - arbeitsmittel - einkaeufe) * 100
                ) / 100;
                return {
                    year,
                    totalValue,
                    shipmentCost,
                    commission,
                    merchandiseValue,
                    erstattungen,
                    arbeitsmittel,
                    einkaeufe,
                    nachzahlungen,
                    gewinn,
                };
            });
    }, [cardmarketOrders, refunds, supplies, purchasesByYear]);

    const yearlyTotals = useMemo(() => ({
        totalValue: sumAndRound(yearlyStats.map((s) => s.totalValue)),
        shipmentCost: sumAndRound(yearlyStats.map((s) => s.shipmentCost)),
        commission: sumAndRound(yearlyStats.map((s) => s.commission)),
        merchandiseValue: sumAndRound(yearlyStats.map((s) => s.merchandiseValue)),
        erstattungen: sumAndRound(yearlyStats.map((s) => s.erstattungen)),
        arbeitsmittel: sumAndRound(yearlyStats.map((s) => s.arbeitsmittel)),
        einkaeufe: sumAndRound(yearlyStats.map((s) => s.einkaeufe)),
        nachzahlungen: sumAndRound(yearlyStats.map((s) => s.nachzahlungen)),
        gewinn: sumAndRound(yearlyStats.map((s) => s.gewinn)),
    }), [yearlyStats]);

    return (
        <Box style={{ width: '100%' }}>
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <BarChartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5">Statistik</Typography>
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
                    <Tab label="Profit Übersicht" />
                    <Tab label="Monatsübersicht" />
                    <Tab label="Jahresübersicht" />
                    <Tab label="Set-Statistik" />
                </Tabs>
                {activeTab === 0 && (
                    <Stack direction="row" spacing={4} flexWrap="wrap" justifyContent="center">
                        <ProfitPieChart
                            title="Beste Konami Sets"
                            subtitle={`Gesamtgewinn: ${bestSetsTotal.toFixed(2)} €`}
                            entries={bestSets.map((s) => ({ label: s.konamiSet, value: s.profit }))}
                            disabled={bestSets.length === 0}
                        />
                        <ProfitPieChart
                            title="Schlechteste Konami Sets"
                            subtitle={`Gesamtgewinn: ${worstSetsTotal.toFixed(2)} €`}
                            entries={worstSets.map((s) => ({ label: s.konamiSet, value: Math.abs(s.profit) }))}
                            disabled={worstSets.length === 0}
                        />
                    </Stack>
                )}
                {activeTab === 1 && (
                    <Stack spacing={2}>
                        <TextField
                            select
                            size="small"
                            label="Jahr"
                            value={selectedYear}
                            onChange={(e) =>
                                setSelectedYear(
                                    e.target.value === 'all' ? 'all' : Number(e.target.value)
                                )
                            }
                            sx={{ maxWidth: 160 }}
                            inputProps={{ 'aria-label': 'Jahr filtern' }}
                        >
                            <MenuItem value="all">Alle Jahre</MenuItem>
                            {availableYears.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </TextField>
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
                                    {filteredMonthlyStats.length > 0 ? (
                                        <>
                                            {filteredMonthlyStats.map((stat) => (
                                                <TableRow key={stat.month}>
                                                    <TableCell>{stat.month}</TableCell>
                                                    <TableCell align="right">{stat.totalValue}</TableCell>
                                                    <TableCell align="right">{stat.shipmentCost}</TableCell>
                                                    <TableCell align="right">{stat.commission}</TableCell>
                                                    <TableCell align="right">{stat.merchandiseValue}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow sx={{ '& td': { fontWeight: 700, borderTop: '2px solid', borderColor: 'divider' } }}>
                                                <TableCell>Gesamt</TableCell>
                                                <TableCell align="right">{filteredMonthlyTotals.totalValue}</TableCell>
                                                <TableCell align="right">{filteredMonthlyTotals.shipmentCost}</TableCell>
                                                <TableCell align="right">{filteredMonthlyTotals.commission}</TableCell>
                                                <TableCell align="right">{filteredMonthlyTotals.merchandiseValue}</TableCell>
                                            </TableRow>
                                        </>
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
                    </Stack>
                )}
                {activeTab === 2 && (
                    <Stack spacing={2}>
                        {yearlyStats.length > 0 && (
                            <Paper variant="outlined" sx={{ p: 2 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
                                    Gesamt:
                                </Typography>
                                <Stack direction="row" flexWrap="wrap" gap={3}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Gesamtwert</Typography>
                                        <Typography variant="body2" fontWeight={600}>{yearlyTotals.totalValue.toFixed(2)} €</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Nachzahlungen</Typography>
                                        <Typography variant="body2" fontWeight={600}>{yearlyTotals.nachzahlungen.toFixed(2)} €</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Versandkosten</Typography>
                                        <Typography variant="body2" fontWeight={600}>{yearlyTotals.shipmentCost.toFixed(2)} €</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Cardmarket Gebühren</Typography>
                                        <Typography variant="body2" fontWeight={600}>{yearlyTotals.commission.toFixed(2)} €</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Erstattungen</Typography>
                                        <Typography variant="body2" fontWeight={600}>{yearlyTotals.erstattungen.toFixed(2)} €</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Arbeitsmittel</Typography>
                                        <Typography variant="body2" fontWeight={600}>{yearlyTotals.arbeitsmittel.toFixed(2)} €</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Einkäufe</Typography>
                                        <Typography variant="body2" fontWeight={600}>{yearlyTotals.einkaeufe.toFixed(2)} €</Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">Gewinn</Typography>
                                        <Typography variant="body2" fontWeight={700} color={yearlyTotals.gewinn >= 0 ? 'success.main' : 'error.main'}>{yearlyTotals.gewinn.toFixed(2)} €</Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        )}
                        <TableContainer component={Paper} elevation={0}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Jahr</strong></TableCell>
                                        <TableCell align="right"><strong>Gesamtwert (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Nachzahlungen (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Versandkosten (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Cardmarket Gebühren (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Erstattungen (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Arbeitsmittel (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Einkäufe (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Gewinn (€)</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {yearlyStats.length > 0 ? (
                                        yearlyStats.map((stat) => (
                                            <TableRow key={stat.year}>
                                                <TableCell>{stat.year}</TableCell>
                                                <TableCell align="right">{stat.totalValue}</TableCell>
                                                <TableCell align="right">{stat.nachzahlungen}</TableCell>
                                                <TableCell align="right">{stat.shipmentCost}</TableCell>
                                                <TableCell align="right">{stat.commission}</TableCell>
                                                <TableCell align="right">{stat.erstattungen}</TableCell>
                                                <TableCell align="right">{stat.arbeitsmittel}</TableCell>
                                                <TableCell align="right">{stat.einkaeufe}</TableCell>
                                                <TableCell align="right" sx={{ fontWeight: 700, color: stat.gewinn >= 0 ? 'success.main' : 'error.main' }}>{stat.gewinn}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={9}>
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
                {activeTab === 3 && (
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
                                        <TableCell align="right"><strong>Einkaufspreis (€)</strong></TableCell>
                                        <TableCell align="right"><strong>Profit (€)</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredSetStats.length > 0 ? (
                                        filteredSetStats.map((s) => (
                                            <TableRow key={s.konamiSet}>
                                                <TableCell>{s.konamiSet}</TableCell>
                                                <TableCell align="right">{s.merchandiseValue}</TableCell>
                                                <TableCell align="right">{s.einkaufspreis !== null ? s.einkaufspreis : '-'}</TableCell>
                                                <TableCell align="right">{s.profit !== null ? s.profit : '-'}</TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4}>
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
