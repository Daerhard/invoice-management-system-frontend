import React, { useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Chip,
    Divider,
    IconButton,
    List,
    Pagination,
    Stack,
    Tab,
    Tabs,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { useAtom } from 'jotai';
import { purchaseInvoicesAtom } from '../../store/Global';
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders';
import usePurchaseInvoices from '../../api/hooks/usePurchaseInvoices';
import AddPurchaseInvoiceDrawer from '../../components/einkaeufe/AddPurchaseInvoiceDrawer';
import PurchaseInvoiceItem from '../../components/einkaeufe/PurchaseInvoiceItem';

export default function Einkaeufe() {
    useCardmarketOrders();
    usePurchaseInvoices();

    const [purchaseInvoices] = useAtom(purchaseInvoicesAtom);

    const [activeTab, setActiveTab] = useState(0);
    const [yearFilter, setYearFilter] = useState<string | null>(null);
    const [productFilter, setProductFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 15;
    const [drawerOpen, setDrawerOpen] = useState(false);

    const availableYears = useMemo(() => {
        const years = new Set<string>();
        purchaseInvoices.forEach((inv) =>
            inv.items?.forEach((item) => {
                const year = typeof item.invoiceDate === 'string' ? item.invoiceDate.slice(0, 4) : undefined;
                if (year) years.add(year);
            })
        );
        return [...years].sort((a, b) => Number(b) - Number(a));
    }, [purchaseInvoices]);

    const availableProducts = useMemo(() => {
        return [...new Set(purchaseInvoices.map((inv) => inv.productName).filter(Boolean))].sort();
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

    const handleClearFilters = () => {
        setYearFilter(null);
        setProductFilter(null);
        setPage(1);
    };

    return (
        <Box style={{ width: '100%' }}>
            <AddPurchaseInvoiceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
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
                        <Tab label="Zusatzmittel" />
                    </Tabs>
                </Box>
                {activeTab === 0 && (
                    <>
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={1.5}>
                                    {filteredInvoices.length > 0 && (
                                        <Chip
                                            label={filteredInvoices.length}
                                            size="small"
                                            color="primary"
                                            sx={{ fontWeight: 600, borderRadius: 1 }}
                                        />
                                    )}
                                </Stack>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Autocomplete
                                        size="small"
                                        sx={{ width: 110 }}
                                        options={availableYears}
                                        value={yearFilter}
                                        onChange={(_, newValue) => {
                                            setYearFilter(newValue);
                                            setPage(1);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Jahr" variant="standard" />
                                        )}
                                    />
                                    <Autocomplete
                                        size="small"
                                        sx={{ width: 180 }}
                                        options={availableProducts}
                                        value={productFilter}
                                        onChange={(_, newValue) => {
                                            setProductFilter(newValue);
                                            setPage(1);
                                        }}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Produkt" variant="standard" />
                                        )}
                                    />
                                    {hasActiveFilters && (
                                        <Tooltip title="Filter zurücksetzen">
                                            <IconButton
                                                size="small"
                                                onClick={handleClearFilters}
                                                aria-label="Filter zurücksetzen"
                                                color="default"
                                            >
                                                <FilterListOffIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                    <Tooltip title="Neuen Einkauf erfassen">
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => setDrawerOpen(true)}
                                            aria-label="Neuen Einkauf erfassen"
                                        >
                                            <AddShoppingCartIcon />
                                        </IconButton>
                                    </Tooltip>
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
                    <Typography variant="body2" color="text.secondary">
                        Keine Erstattungen vorhanden.
                    </Typography>
                )}
                {activeTab === 2 && (
                    <Typography variant="body2" color="text.secondary">
                        Keine Zusatzmittel vorhanden.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
}

