import React, { useState } from 'react';
import { Alert, Button, CircularProgress, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getInvoicePDF } from '../../api/generated/invoice-generation-pd-f';
import { getInvoicePdf } from '../../api/generated/invoices';
import { useGenericRequest } from '../../api/hooks/useGenericRequest';
import { useSaveInvoiceMutation } from '../../queries/useSaveInvoiceMutation';
import PDFInvoice from '../../components/invoices/InvoicePDF';
import { CardmarketOrder } from '../../api/generated/Schemas'
import { formatStringToDate } from '../../helper/Utils'

interface PDFInvoicePreviewProps {
    cardmarketOrder: CardmarketOrder;
    open: boolean;
    onClose: () => void;
    invoiceSaved: boolean;
}

export default function PDFInvoicePreview({ cardmarketOrder, open, onClose, invoiceSaved }: Readonly<PDFInvoicePreviewProps>) {
    const { data: fetchedGeneratedPDF } = useGenericRequest(
        `getPDFInvoice-${cardmarketOrder.order_id}`,
        () => getInvoicePDF(cardmarketOrder.order_id),
        { enabled: !invoiceSaved },
    );

    const { data: fetchedSavedPDF } = useGenericRequest(
        `getSavedInvoicePdf-${cardmarketOrder.order_id}`,
        () => getInvoicePdf(cardmarketOrder.order_id),
        { enabled: invoiceSaved },
    );

    const invoice = invoiceSaved ? fetchedSavedPDF?.data : fetchedGeneratedPDF?.data;

    const saveInvoiceMutation = useSaveInvoiceMutation();
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleSave = async () => {
        setSaveSuccess(false);
        try {
            await saveInvoiceMutation.mutateAsync(cardmarketOrder.order_id);
            setSaveSuccess(true);
        } catch {
            // error shown via saveInvoiceMutation.isError
        }
    };

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

    const isSaved = invoiceSaved || saveSuccess;

    return (
        <Dialog style={{ display: 'flex' }} open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>Rechnungsvorschau</DialogTitle>
            <DialogContent>
                {invoice ? (
                    <PDFInvoice invoice={invoice} />
                ) : (
                    <Typography>Vorschau ist im Moment nicht verfügbar</Typography>
                )}
                {saveSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        Rechnung erfolgreich gespeichert!
                    </Alert>
                )}
                {saveInvoiceMutation.isError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        Speichern fehlgeschlagen.
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Schließen
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    variant="outlined"
                    disabled={isSaved || saveInvoiceMutation.isPending}
                    startIcon={saveInvoiceMutation.isPending ? <CircularProgress size={16} /> : undefined}
                >
                    {isSaved ? 'Rechnung gespeichert' : 'Rechnung speichern'}
                </Button>
                <Button onClick={handleDownload} color="primary" disabled={!invoice}>
                    Download Rechnung
                </Button>
            </DialogActions>
        </Dialog>
    );
}
