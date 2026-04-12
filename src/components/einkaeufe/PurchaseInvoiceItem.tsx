import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Chip,
    Divider,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { faFileInvoiceDollar, faFilePdf, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomIconButton from '../../customComponents/CustomIconButton';
import { PurchaseInvoice, PurchaseInvoiceItem as PurchaseInvoiceItemType } from '../../api/generated/Schemas';
import { formatStringToDate } from '../../helper/Utils';
import { getPurchaseInvoiceItemPdf } from '../../api/generated/purchase-invoices';
import useDeletePurchaseInvoiceItem from '../../api/hooks/useDeletePurchaseInvoiceItem';
import AddPurchaseInvoiceItemDrawer from './AddPurchaseInvoiceItemDrawer';

interface PurchaseInvoiceItemProps {
    purchaseInvoice: PurchaseInvoice;
}

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
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ py: 0.5 }}>
            <Stack direction="row" spacing={2} alignItems="center">
                <Chip label={item.purchaseType} size="small" variant="outlined" />
                <Typography variant="body2" color="text.secondary">
                    {`${item.amount}x · ${item.price.toFixed(2)} € · ${formatStringToDate(item.invoiceDate)}`}
                </Typography>
                {pdfError && (
                    <Typography variant="caption" color="error">
                        PDF konnte nicht geladen werden
                    </Typography>
                )}
                {deleteError && (
                    <Typography variant="caption" color="error">
                        {deleteError}
                    </Typography>
                )}
            </Stack>
            <Stack direction="row" alignItems="center">
                {item.id !== undefined && (
                    <Tooltip title="PDF öffnen">
                        <IconButton size="small" onClick={handleOpenPdf} aria-label="PDF öffnen">
                            <FontAwesomeIcon icon={faFilePdf} size="xs" />
                        </IconButton>
                    </Tooltip>
                )}
                {item.id !== undefined && (
                    <Tooltip title="Position löschen">
                        <IconButton
                            size="small"
                            onClick={handleDelete}
                            aria-label="Position löschen"
                            disabled={deleteLoading}
                            color="error"
                        >
                            <FontAwesomeIcon icon={faTrash} size="xs" />
                        </IconButton>
                    </Tooltip>
                )}
            </Stack>
        </Stack>
    );
}

export default function PurchaseInvoiceItem({ purchaseInvoice }: Readonly<PurchaseInvoiceItemProps>) {
    const [addItemDrawerOpen, setAddItemDrawerOpen] = useState(false);

    return (
        <>
            <AddPurchaseInvoiceItemDrawer
                open={addItemDrawerOpen}
                onClose={() => setAddItemDrawerOpen(false)}
                invoiceId={purchaseInvoice.id!}
                invoiceName={purchaseInvoice.productName}
            />
            <Card sx={{ width: '100%', marginBottom: '0.4rem' }}>
                <CardHeader
                    avatar={
                        <Box sx={{ color: 'primary.main' }}>
                            <FontAwesomeIcon icon={faFileInvoiceDollar} size="lg" />
                        </Box>
                    }
                    action={
                        <Stack direction="row" alignItems="center">
                            <CustomIconButton
                                title="Position hinzufügen"
                                titleVariant="body2"
                                icon={faPlus}
                                iconSize="xs"
                                onClick={() => setAddItemDrawerOpen(true)}
                            />
                        </Stack>
                    }
                    title={
                        <Typography variant="body2" fontWeight={600}>
                            {purchaseInvoice.productName}
                        </Typography>
                    }
                    subheader={
                        <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                            <Typography variant="body2" color="text.secondary">
                                {`${purchaseInvoice.items?.length ?? 0} Position(en)`}
                            </Typography>
                            {purchaseInvoice.totalPrice !== undefined && (
                                <Typography variant="body2" color="text.secondary">
                                    {`Gesamt: ${purchaseInvoice.totalPrice.toFixed(2)} €`}
                                </Typography>
                            )}
                        </Stack>
                    }
                />
                {purchaseInvoice.items && purchaseInvoice.items.length > 0 && (
                    <CardContent sx={{ pt: 0, pb: '8px !important' }}>
                        <Divider sx={{ mb: 1 }} />
                        <Stack divider={<Divider flexItem />}>
                            {purchaseInvoice.items.map((item, index) => (
                                <InvoiceChildItem
                                    key={item.id ?? index}
                                    invoiceId={purchaseInvoice.id!}
                                    item={item}
                                />
                            ))}
                        </Stack>
                    </CardContent>
                )}
            </Card>
        </>
    );
}
