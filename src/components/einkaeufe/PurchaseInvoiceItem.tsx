import React, { useState } from 'react';
import {
    Box, Chip, Collapse, Divider, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { PurchaseInvoice, PurchaseInvoiceItem as PurchaseInvoiceItemType } from '../../api/generated/Schemas';
import { formatStringToDate } from '../../helper/Utils';
import { getPurchaseInvoiceItemPdf } from '../../api/generated/purchase-invoices';
import useDeletePurchaseInvoiceItem from '../../api/hooks/useDeletePurchaseInvoiceItem';
import AddPurchaseInvoiceItemDrawer from './AddPurchaseInvoiceItemDrawer';

interface InvoiceChildItemProps {
    invoiceId: number;
    item: PurchaseInvoiceItemType;
}

function InvoiceChildItem({ invoiceId, item }: Readonly<InvoiceChildItemProps>) {
    const [pdfError, setPdfError] = useState(false);
    const { handleDelete, loading: deleteLoading, error: deleteError } = useDeletePurchaseInvoiceItem(invoiceId, item.id!);

    const handleOpenPdf = async () => {
        setPdfError(false);
        try {
            const response = await getPurchaseInvoiceItemPdf(invoiceId, item.id!);
            const url = URL.createObjectURL(response.data);
            window.open(url, '_blank');
        } catch {
            setPdfError(true);
        }
    };

    return (
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.75 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <Chip label={item.purchaseType} size="small" variant="outlined" sx={{ fontSize: '0.72rem' }} />
                <Typography variant="body2" color="text.secondary">
                    {item.amount}x · {item.price.toFixed(2)} € · {formatStringToDate(item.invoiceDate)}
                </Typography>
                {pdfError && <Typography variant="caption" color="error">PDF nicht verfügbar</Typography>}
                {deleteError && <Typography variant="caption" color="error">{deleteError}</Typography>}
            </Stack>
            <Stack direction="row" alignItems="center">
                {item.id !== undefined && (
                    <Tooltip title="PDF öffnen">
                        <IconButton size="small" onClick={handleOpenPdf} aria-label="PDF öffnen">
                            <PictureAsPdfIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                )}
                {item.id !== undefined && (
                    <Tooltip title="Position löschen">
                        <IconButton
                            size="small"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            color="error"
                            aria-label="Position löschen"
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
        </Stack>
    );
}

interface PurchaseInvoiceItemProps {
    purchaseInvoice: PurchaseInvoice;
}

export default function PurchaseInvoiceItem({ purchaseInvoice }: Readonly<PurchaseInvoiceItemProps>) {
    const [open, setOpen] = useState(false);
    const [addItemDrawerOpen, setAddItemDrawerOpen] = useState(false);
    const hasItems = (purchaseInvoice.items?.length ?? 0) > 0;

    return (
        <>
            <AddPurchaseInvoiceItemDrawer
                open={addItemDrawerOpen}
                onClose={() => setAddItemDrawerOpen(false)}
                invoiceId={purchaseInvoice.id!}
                invoiceName={purchaseInvoice.productName}
            />
            <Box
                sx={{
                    width: '100%',
                    mb: 0.75,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    overflow: 'hidden',
                    transition: 'border-color 0.15s ease',
                    '&:hover': { borderColor: 'rgba(61,107,82,0.35)' },
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25 }}>
                    <Box sx={{
                        width: 36, height: 36, borderRadius: 1.5,
                        bgcolor: 'rgba(61,107,82,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'primary.main', flexShrink: 0,
                    }}>
                        <LocalMallOutlinedIcon sx={{ fontSize: 18 }} />
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                            {purchaseInvoice.productName}
                        </Typography>
                        <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                            <Typography variant="caption" color="text.secondary">
                                {purchaseInvoice.items?.length ?? 0} Position(en)
                            </Typography>
                            {purchaseInvoice.totalPrice !== undefined && (
                                <Typography variant="caption" fontWeight={600} color="primary.main">
                                    {purchaseInvoice.totalPrice.toFixed(2)} €
                                </Typography>
                            )}
                        </Stack>
                    </Box>

                    <Stack direction="row" alignItems="center" spacing={0.25} flexShrink={0}>
                        <Tooltip title="Position hinzufügen">
                            <IconButton
                                size="small"
                                onClick={() => setAddItemDrawerOpen(true)}
                                color="primary"
                                aria-label="Position hinzufügen"
                            >
                                <AddIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </Tooltip>
                        {hasItems && (
                            <Tooltip title={open ? 'Positionen ausblenden' : 'Positionen anzeigen'}>
                                <IconButton size="small" onClick={() => setOpen(!open)} aria-label="Positionen">
                                    <KeyboardArrowDownIcon
                                        sx={{
                                            fontSize: 18,
                                            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>
                </Box>

                <Collapse in={open && hasItems} timeout="auto" unmountOnExit>
                    <Box sx={{ px: 2, pb: 1.5, pt: 0.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#FAFAF8' }}>
                        <Stack divider={<Divider flexItem />}>
                            {purchaseInvoice.items!.map((item, index) => (
                                <InvoiceChildItem
                                    key={item.id ?? index}
                                    invoiceId={purchaseInvoice.id!}
                                    item={item}
                                />
                            ))}
                        </Stack>
                    </Box>
                </Collapse>
            </Box>
        </>
    );
}
