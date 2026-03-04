import React, { useState } from 'react';
import {
    Box,
    Chip,
    Divider,
    IconButton,
    List,
    Pagination,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
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

    const sortedInvoices = [...purchaseInvoices].sort(
        (a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
    );

    const [page, setPage] = useState(1);
    const itemsPerPage = 15;
    const [drawerOpen, setDrawerOpen] = useState(false);

    const paginatedInvoices = sortedInvoices.slice(
        (page - 1) * itemsPerPage,
        page * itemsPerPage
    );

    return (
        <Box style={{ width: '100%' }}>
            <AddPurchaseInvoiceDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <ShoppingCartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h5">Einkäufe</Typography>
                            {sortedInvoices.length > 0 && (
                                <Chip
                                    label={sortedInvoices.length}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600, borderRadius: 1 }}
                                />
                            )}
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={2}>
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
                                count={Math.ceil(sortedInvoices.length / itemsPerPage)}
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
            </Stack>
        </Box>
    );
}

