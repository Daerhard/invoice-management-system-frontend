import React from 'react';
import { Button, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getInvoicePDF } from '../../api/generated/invoice-generation-pd-f';
import { useGenericRequest } from '../../api/hooks/useGenericRequest';
import PDFInvoice from '../../components/invoices/PDFInvoice';
import { CardmarketOrder } from '../../api/generated/Schemas'
import { formatStringToDate } from '../../helper/Utils'

interface PDFInvoicePreviewProps {
    cardmarketOrder: CardmarketOrder;
    open: boolean;
    onClose: () => void;
}

export default function PDFInvoicePreview({ cardmarketOrder, open, onClose }: Readonly<PDFInvoicePreviewProps>) {
    const { data: fetchedPDFInvoice } = useGenericRequest(
        'getPDFInvoice',
        () => getInvoicePDF(cardmarketOrder.order_id),
    );

    const invoice = fetchedPDFInvoice?.data;

    const handleDownload = () => {
        if (invoice) {
            const url = URL.createObjectURL(invoice);
            const a = document.createElement('a');
            a.href = url;
            a.download =  `${formatStringToDate(cardmarketOrder.payment_date)} - Rechnung ${cardmarketOrder.order_id} - ${cardmarketOrder.customer.user_name}.pdf`
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <Dialog style={{ display: 'flex' }} open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Rechnungsvorschau</DialogTitle>
            <DialogContent>
                {invoice ? (
                    <PDFInvoice invoice={invoice} />
                ) : (
                    <Typography>Vorschau ist im Moment nicht verfügbar</Typography>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Schließen
                </Button>
                <Button onClick={handleDownload} color="primary">
                    Download Rechnung
                </Button>
            </DialogActions>
        </Dialog>
    );
}
