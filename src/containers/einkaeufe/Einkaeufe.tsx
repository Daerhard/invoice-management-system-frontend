import React, { useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    Divider,
    IconButton,
    List,
    Pagination,
    Popover,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CategoryIcon from '@mui/icons-material/Category';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useAtom } from 'jotai';
import { purchaseInvoicesAtom, refundsAtom, suppliesAtom } from '../../store/Global';
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders';
import usePurchaseInvoices from '../../api/hooks/usePurchaseInvoices';
import useRefunds from '../../api/hooks/useRefunds';
import useSupplies from '../../api/hooks/useSupplies';
import AddPurchaseInvoiceDrawer from '../../components/einkaeufe/AddPurchaseInvoiceDrawer';
import PurchaseInvoiceItem from '../../components/einkaeufe/PurchaseInvoiceItem';
import AddRefundDrawer from '../../components/einkaeufe/AddRefundDrawer';
import RefundItem from '../../components/einkaeufe/RefundItem';
import AddSupplyDrawer from '../../components/einkaeufe/AddSupplyDrawer';
import SupplyItem from '../../components/einkaeufe/SupplyItem';

export default function Einkaeufe() {
    useCardmarketOrders();
    usePurchaseInvoices();
    useRefunds();
    useSupplies();

    const [purchaseInvoices] = useAtom(purchaseInvoicesAtom);
    const [refunds] = useAtom(refundsAtom);
    const [supplies] = useAtom(suppliesAtom);

    const [activeTab, setActiveTab] = useState(0);
    const [yearFilter, setYearFilter] = useState<string | null>(null);
    const [productFilter, setProductFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 15;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [refundDrawerOpen, setRefundDrawerOpen] = useState(false);
    const [supplyDrawerOpen, setSupplyDrawerOpen] = useState(false);

    const [yearAnchorEl, setYearAnchorEl] = useState<HTMLElement | null>(null);
    const [productAnchorEl, setProductAnchorEl] = useState<HTMLElement | null>(null);

    const availableYears = useMemo(() => {
        const years = new Set<string>();
        purchaseInvoices.forEach((inv) =>
            inv.items?.forEach((item) => {
                const year = typeof item.invoiceDate === 'string' ? item.invoiceDate.slice(0, 4) : undefined;
                if (year) years.add(year);
            })
        );
        return Array.from(years).sort((a, b) => Number(b) - Number(a));
    }, [purchaseInvoices]);

    const availableProducts = useMemo(() => {
        return Array.from(new Set(purchaseInvoices.map((inv) => inv.productName).filter(Boolean))).sort();
    }, [purchaseInvoices]);

    const hasActiveFilters = yearFilter !== null || productFilter !== null;

    const sortedInvoices = useMemo(
        () => [...purchaseInvoices].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
        [purchaseInvoices]
    );

    const filteredInvoices = useMemo(() => {
        return sortedInvoices.filter((inv) => {
            const yearMatch =
                !yearFilter ||
                (inv.items?.some((item) =>
                    typeof item.invoiceDate === 'string' && item.invoiceDate.slice(0, 4) === yearFilter
                ) ?? false);
            const productMatch = !productFilter || inv.productName === productFilter;
            return yearMatch && productMatch;
        });
    }, [sortedInvoices, yearFilter, productFilter]);

    const paginatedInvoices = filteredInvoices.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const sortedRefunds = useMemo(
        () => [...refunds].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
        [refunds]
    );

    const sortedSupplies = useMemo(
        () => [...supplies].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
        [supplies]
    );

    const handleClearFilters = () => {
        setYearFilter(null);
        setProductFilter(null);
        setPage(1);
    };

    return (
        <Box style={{ width: '100%' }}>
            <AddPurchaseInvoiceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <AddRefundDrawer open={refundDrawerOpen} onClose={() => setRefundDrawerOpen(false)} />
            <AddSupplyDrawer open={supplyDrawerOpen} onClose={() => setSupplyDrawerOpen(false)} />

            <Popover
                open={Boolean(yearAnchorEl)}
                anchorEl={yearAnchorEl}
                onClose={() => setYearAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                aria-label="Jahr Filter"
            >
                <Box sx={{ p: 2, width: 160 }}>
                    <Autocomplete
                        size="small"
                        options={availableYears}
                        value={yearFilter}
                        onChange={(_, newValue) => {
                            setYearFilter(newValue);
                            setPage(1);
                            setYearAnchorEl(null);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Jahr" variant="outlined" autoFocus />
                        )}
                    />
                </Box>
            </Popover>

            <Popover
                open={Boolean(productAnchorEl)}
                anchorEl={productAnchorEl}
                onClose={() => setProductAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                aria-label="Produkt Filter"
            >
                <Box sx={{ p: 2, width: 220 }}>
                    <Autocomplete
                        size="small"
                        options={availableProducts}
                        value={productFilter}
                        onChange={(_, newValue) => {
                            setProductFilter(newValue);
                            setPage(1);
                            setProductAnchorEl(null);
                        }}
                        renderInput={(params) => (
                            <TextField {...params} label="Produkt" variant="outlined" autoFocus />
                        )}
                    />
                </Box>
            </Popover>

            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <ShoppingCartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5">Ausgaben</Typography>
                    </Stack>
                    <Divider sx={{ mt: 2 }} />
                    <Tabs
                        value={activeTab}
                        onChange={(_, newValue) => setActiveTab(newValue)}
                        sx={{ mt: 1 }}
                    >
                        <Tab label="Einkäufe" />
                        <Tab label="Erstattungen" />
                        <Tab label="Arbeitsmittel" />
                    </Tabs>
                </Box>

                {activeTab === 0 && (
                    <>
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {filteredInvoices.length > 0 && (
                                        <Chip
                                            label={filteredInvoices.length}
                                            size="small"
                                            color="primary"
                                            sx={{ fontWeight: 600, borderRadius: 1 }}
                                        />
                                    )}
                                    <Tooltip title={yearFilter ? `Jahr: ${yearFilter}` : 'Nach Jahr filtern'}>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => setYearAnchorEl(e.currentTarget)}
                                            color={yearFilter ? 'primary' : 'default'}
                                            aria-label="Nach Jahr filtern"
                                        >
                                            <CalendarTodayIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={productFilter ? `Produkt: ${productFilter}` : 'Nach Produkt filtern'}>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => setProductAnchorEl(e.currentTarget)}
                                            color={productFilter ? 'primary' : 'default'}
                                            aria-label="Nach Produkt filtern"
                                        >
                                            <CategoryIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    {hasActiveFilters && (
                                        <Tooltip title="Filter zurücksetzen">
                                            <IconButton
                                                size="small"
                                                onClick={handleClearFilters}
                                                aria-label="Filter zurücksetzen"
                                            >
                                                <RestartAltIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={() => setDrawerOpen(true)}
                                        aria-label="Neuen Einkauf erfassen"
                                    >
                                        Hinzufügen
                                    </Button>
                                    <Pagination
                                        count={Math.ceil(filteredInvoices.length / itemsPerPage)}
                                        page={page}
                                        onChange={(_, newValue) => setPage(newValue)}
                                        shape="rounded"
                                        color="primary"
                                    />
                                </Stack>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Einkäufe manuell erfassen und verwalten
                            </Typography>
                            <Divider sx={{ mt: 2 }} />
                        </Box>
                        <List dense disablePadding>
                            {paginatedInvoices.length > 0 ? (
                                paginatedInvoices.map((invoice) => (
                                    <PurchaseInvoiceItem key={invoice.id} purchaseInvoice={invoice} />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Keine Einkäufe vorhanden.
                                </Typography>
                            )}
                        </List>
                    </>
                )}

                {activeTab === 1 && (
                    <>
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {sortedRefunds.length > 0 && (
                                        <Chip
                                            label={sortedRefunds.length}
                                            size="small"
                                            color="primary"
                                            sx={{ fontWeight: 600, borderRadius: 1 }}
                                        />
                                    )}
                                </Stack>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => setRefundDrawerOpen(true)}
                                    aria-label="Neue Erstattung erfassen"
                                >
                                    Hinzufügen
                                </Button>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Erstattungen manuell erfassen und verwalten
                            </Typography>
                            <Divider sx={{ mt: 2 }} />
                        </Box>
                        <List dense disablePadding>
                            {sortedRefunds.length > 0 ? (
                                sortedRefunds.map((refund) => (
                                    <RefundItem key={refund.id} refund={refund} />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Keine Erstattungen vorhanden.
                                </Typography>
                            )}
                        </List>
                    </>
                )}

                {activeTab === 2 && (
                    <>
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {sortedSupplies.length > 0 && (
                                        <Chip
                                            label={sortedSupplies.length}
                                            size="small"
                                            color="primary"
                                            sx={{ fontWeight: 600, borderRadius: 1 }}
                                        />
                                    )}
                                </Stack>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={() => setSupplyDrawerOpen(true)}
                                    aria-label="Neues Arbeitsmittel erfassen"
                                >
                                    Hinzufügen
                                </Button>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                Arbeitsmittel manuell erfassen und verwalten
                            </Typography>
                            <Divider sx={{ mt: 2 }} />
                        </Box>
                        <List dense disablePadding>
                            {sortedSupplies.length > 0 ? (
                                sortedSupplies.map((supply) => (
                                    <SupplyItem key={supply.id} supply={supply} />
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">
                                    Keine Arbeitsmittel vorhanden.
                                </Typography>
                            )}
                        </List>
                    </>
                )}
            </Stack>
        </Box>
    );
}
