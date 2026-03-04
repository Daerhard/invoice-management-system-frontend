import React, { useState } from 'react';
import { Box, Card, CardHeader, Stack, Typography } from '@mui/material';
import { faFileInvoiceDollar, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomIconButton from '../../customComponents/CustomIconButton';
import { PurchaseInvoice } from '../../api/generated/Schemas';
import { formatStringToDate } from '../../helper/Utils';
import { getPurchaseInvoicePdf } from '../../api/generated/purchase-invoices';

interface PurchaseInvoiceItemProps {
    purchaseInvoice: PurchaseInvoice;
}

export default function PurchaseInvoiceItem({ purchaseInvoice }: Readonly<PurchaseInvoiceItemProps>) {
    const [pdfError, setPdfError] = useState(false);

    const handleOpenPdf = async () => {
        setPdfError(false);
        try {
            const response = await getPurchaseInvoicePdf<{ data: Blob }>(purchaseInvoice.id);
            const url = URL.createObjectURL(response.data);
            window.open(url, '_blank');
        } catch {
            setPdfError(true);
        }
    };

    return (
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
                            title="PDF öffnen"
                            titleVariant="body2"
                            icon={faFilePdf}
                            iconSize="xs"
                            onClick={handleOpenPdf}
                        />
                    </Stack>
                }
                title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontWeight={600}>
                            {purchaseInvoice.productName}
                        </Typography>
                        {pdfError && (
                            <Typography variant="caption" color="error">
                                PDF konnte nicht geladen werden
                            </Typography>
                        )}
                    </Stack>
                }
                subheader={
                    <Stack direction="row" spacing={3} sx={{ mt: 0.25 }}>
                        <Typography variant="body2" color="text.secondary">
                            {`Datum: ${formatStringToDate(purchaseInvoice.invoiceDate)}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {`Anzahl: ${purchaseInvoice.amount}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {`Preis: ${purchaseInvoice.price.toFixed(2)} €`}
                        </Typography>
                    </Stack>
                }
            />
        </Card>
    );
}
