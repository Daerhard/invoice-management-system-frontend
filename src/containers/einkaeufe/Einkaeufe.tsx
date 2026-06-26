import React, { useMemo, useState } from 'react';
import {
    Autocomplete,
    Box,
    Button,
    Chip,
    CircularProgress,
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
import CategoryIcon from '@mui/icons-material/Category';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { useAtom } from 'jotai';
import { cardmarketPurchasesAtom, purchaseInvoicesAtom, refundsAtom, suppliesAtom } from '../../store/Global';
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders';
import useCardmarketPurchases from '../../api/hooks/useCardmarketPurchases';
import usePurchaseInvoices from '../../api/hooks/usePurchaseInvoices';
import useRefunds from '../../api/hooks/useRefunds';
import useSupplies from '../../api/hooks/useSupplies';
import AddPurchaseInvoiceDrawer from '../../components/einkaeufe/AddPurchaseInvoiceDrawer';
import PurchaseInvoiceItem from '../../components/einkaeufe/PurchaseInvoiceItem';
import AddRefundDrawer from '../../components/einkaeufe/AddRefundDrawer';
import RefundItem from '../../components/einkaeufe/RefundItem';
import AddSupplyDrawer from '../../components/einkaeufe/AddSupplyDrawer';
import SupplyItem from '../../components/einkaeufe/SupplyItem';
import CardmarketPurchaseItem from '../../components/einkaeufe/CardmarketPurchaseItem';
import ImportPurchasesDrawer from '../../components/einkaeufe/ImportPurchasesDrawer';

export default function Einkaeufe() {
    useCardmarketOrders();
    usePurchaseInvoices();
    useRefunds();
    useSupplies();
    const { isLoading: purchasesLoading } = useCardmarketPurchases();

    const [purchaseInvoices] = useAtom(purchaseInvoicesAtom);
    const [refunds] = useAtom(refundsAtom);
    const [supplies] = useAtom(suppliesAtom);
    const [cardmarketPurchases] = useAtom(cardmarketPurchasesAtom);

    const [activeTab, setActiveTab] = useState(0);
    const [einkaufeSubTab, setEinkaufeSubTab] = useState(0);
    const [globalYearFilter, setGlobalYearFilter] = useState<string | null>(null);
    const [productFilter, setProductFilter] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 15;
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [refundDrawerOpen, setRefundDrawerOpen] = useState(false);
    const [supplyDrawerOpen, setSupplyDrawerOpen] = useState(false);
    const [importPurchasesDrawerOpen, setImportPurchasesDrawerOpen] = useState(false);
    const [productAnchorEl, setProductAnchorEl] = useState<HTMLElement | null>(null);

    const allAvailableYears = useMemo(() => {
        const years = new Set<string>();
        purchaseInvoices.forEach((inv) =>
            inv.items?.forEach((item) => {
                if (typeof item.invoiceDate === 'string') years.add(item.invoiceDate.slice(0, 4));
            })
        );
        cardmarketPurchases.forEach((p) => {
            if (typeof p.dateOfPayment === 'string') years.add(p.dateOfPayment.slice(0, 4));
        });
        refunds.forEach((r) => years.add(String(r.year)));
        supplies.forEach((s) => {
            if (typeof s.supplyDate === 'string') years.add(s.supplyDate.slice(0, 4));
        });
        return Array.from(years).sort((a, b) => Number(b) - Number(a));
    }, [purchaseInvoices, cardmarketPurchases, refunds, supplies]);

    const availableProducts = useMemo(() => {
        return Array.from(new Set(purchaseInvoices.map((inv) => inv.productName).filter(Boolean))).sort();
    }, [purchaseInvoices]);

    const sortedInvoices = useMemo(
        () => [...purchaseInvoices].sort((a, b) => (b.id ?? 0) - (a.id ?? 0)),
        [purchaseInvoices]
    );

    const filteredInvoices = useMemo(() => {
        return sortedInvoices.filter((inv) => {
            const yearMatch =
                !globalYearFilter ||
                (inv.items?.some((item) =>
                    typeof item.invoiceDate === 'string' && item.invoiceDate.slice(0, 4) === globalYearFilter
                ) ?? false);
            const productMatch = !productFilter || inv.productName === productFilter;
            return yearMatch && productMatch;
        });
    }, [sortedInvoices, globalYearFilter, productFilter]);

    const paginatedInvoices = filteredInvoices.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    const filteredPurchases = useMemo(() => {
        const sorted = [...cardmarketPurchases].sort((a, b) => b.externalOrderId - a.externalOrderId);
        if (!globalYearFilter) return sorted;
        return sorted.filter((p) => typeof p.dateOfPayment === 'string' && p.dateOfPayment.slice(0, 4) === globalYearFilter);
    }, [cardmarketPurchases, globalYearFilter]);

    const filteredRefunds = useMemo(() => {
        const sorted = [...refunds].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        if (!globalYearFilter) return sorted;
        return sorted.filter((r) => String(r.year) === globalYearFilter);
    }, [refunds, globalYearFilter]);

    const filteredSupplies = useMemo(() => {
        const sorted = [...supplies].sort((a, b) => (b.id ?? 0) - (a.id ?? 0));
        if (!globalYearFilter) return sorted;
        return sorted.filter((s) => typeof s.supplyDate === 'string' && s.supplyDate.slice(0, 4) === globalYearFilter);
    }, [supplies, globalYearFilter]);

    return (
        <Box style={{ width: '100%' }}>
            <AddPurchaseInvoiceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <AddRefundDrawer open={refundDrawerOpen} onClose={() => setRefundDrawerOpen(false)} />
            <AddSupplyDrawer open={supplyDrawerOpen} onClose={() => setSupplyDrawerOpen(false)} />
            <ImportPurchasesDrawer open={importPurchasesDrawerOpen} onClose={() => setImportPurchasesDrawerOpen(false)} />

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
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <ShoppingCartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h5">Ausgaben</Typography>
                        </Stack>
                        <Autocomplete
                            size="small"
                            options={allAvailableYears}
                            value={globalYearFilter}
                            onChange={(_, newValue) => {
                                setGlobalYearFilter(newValue);
                                setPage(1);
                            }}
                            sx={{ width: 130 }}
                            renderInput={(params) => (
                                <TextField {...params} label="Jahr" variant="outlined" />
                            )}
                        />
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
                        <Tabs
                            value={einkaufeSubTab}
                            onChange={(_, newValue) => setEinkaufeSubTab(newValue)}
                            sx={{ mt: -1, mb: 1, minHeight: 36 }}
                            TabIndicatorProps={{ sx: { height: 2 } }}
                        >
                            <Tab label="Wareneinkäufe" sx={{ minHeight: 36, fontSize: '0.8rem' }} />
                            <Tab label="Einzelkarteneinkäufe" sx={{ minHeight: 36, fontSize: '0.8rem' }} />
                        </Tabs>

                        {einkaufeSubTab === 0 && (
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
                                            {productFilter && (
                                                <Tooltip title="Produktfilter zurücksetzen">
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => { setProductFilter(null); setPage(1); }}
                                                        aria-label="Produktfilter zurücksetzen"
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

                        {einkaufeSubTab === 1 && (
                            <>
                                <Box>
                                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            {filteredPurchases.length > 0 && (
                                                <Chip
                                                    label={filteredPurchases.length}
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
                                            startIcon={<FileUploadIcon />}
                                            onClick={() => setImportPurchasesDrawerOpen(true)}
                                            aria-label="Karteneinkäufe importieren"
                                        >
                                            Import
                                        </Button>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                                        Cardmarket Einzelkarteneinkäufe aus CSV-Import
                                    </Typography>
                                    <Divider sx={{ mt: 2 }} />
                                </Box>
                                {purchasesLoading ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                        <CircularProgress />
                                    </Box>
                                ) : (
                                    <List dense disablePadding>
                                        {filteredPurchases.length > 0 ? (
                                            filteredPurchases.map((purchase) => (
                                                <CardmarketPurchaseItem key={purchase.id ?? purchase.externalOrderId} purchase={purchase} />
                                            ))
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                Keine Karteneinkäufe vorhanden.
                                            </Typography>
                                        )}
                                    </List>
                                )}
                            </>
                        )}
                    </>
                )}

                {activeTab === 1 && (
                    <>
                        <Box>
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    {filteredRefunds.length > 0 && (
                                        <Chip
                                            label={filteredRefunds.length}
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
                            {filteredRefunds.length > 0 ? (
                                filteredRefunds.map((refund) => (
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
                                    {filteredSupplies.length > 0 && (
                                        <Chip
                                            label={filteredSupplies.length}
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
                            {filteredSupplies.length > 0 ? (
                                filteredSupplies.map((supply) => (
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
