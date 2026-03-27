import React, { useMemo, useState } from 'react';
import { Alert, Box, Button, CircularProgress, TextField, Typography, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { getInvoicePDF } from '../../api/generated/invoice-generation-pd-f';
import { useGenericRequest } from '../../api/hooks/useGenericRequest';
import { useSaveInvoiceMutation } from '../../queries/useSaveInvoiceMutation';
import { useSendInvoiceEmailMutation, useSendTestInvoiceEmailMutation } from '../../queries/useSendInvoiceEmailMutation';
import PDFInvoice from '../../components/invoices/InvoicePDF';
import { CardmarketOrder } from '../../api/generated/Schemas'
import { formatStringToDate } from '../../helper/Utils'

interface PDFInvoicePreviewProps {
    cardmarketOrder: CardmarketOrder;
    open: boolean;
    onClose: () => void;
}

export default function PDFInvoicePreview({ cardmarketOrder, open, onClose }: Readonly<PDFInvoicePreviewProps>) {
    const invoiceSaved = !!cardmarketOrder.invoice;

    const { data: fetchedGeneratedPDF } = useGenericRequest(
        `getPDFInvoice-${cardmarketOrder.order_id}`,
        () => getInvoicePDF(cardmarketOrder.order_id),
        { enabled: !invoiceSaved },
    );

    const savedPdfBlob = useMemo(() => {
        const base64 = cardmarketOrder.invoice?.invoicePdf;
        if (!base64) return null;
        try {
            const binaryStr = atob(base64);
            const bytes = new Uint8Array(binaryStr.length);
            for (let i = 0; i < binaryStr.length; i++) {
                bytes[i] = binaryStr.charCodeAt(i);
            }
            return new Blob([bytes], { type: 'application/pdf' });
        } catch {
            return null;
        }
    }, [cardmarketOrder.invoice?.invoicePdf]);

    const invoice = invoiceSaved ? savedPdfBlob : fetchedGeneratedPDF?.data;

    const saveInvoiceMutation = useSaveInvoiceMutation();
    const [saveSuccess, setSaveSuccess] = useState(false);

    const sendEmailMutation = useSendInvoiceEmailMutation();
    const [emailSuccess, setEmailSuccess] = useState(false);

    const sendTestEmailMutation = useSendTestInvoiceEmailMutation();
    const [testEmailSuccess, setTestEmailSuccess] = useState(false);
    const [testEmail, setTestEmail] = useState('');

    const handleSave = async () => {
        setSaveSuccess(false);
        try {
            await saveInvoiceMutation.mutateAsync(cardmarketOrder.order_id);
            setSaveSuccess(true);
        } catch {
            // error shown via saveInvoiceMutation.isError
        }
    };

    const handleSendEmail = async () => {
        setEmailSuccess(false);
        try {
            await sendEmailMutation.mutateAsync(cardmarketOrder.order_id);
            setEmailSuccess(true);
        } catch {
            // error shown via sendEmailMutation.isError
        }
    };

    const handleSendTestEmail = async () => {
        setTestEmailSuccess(false);
        try {
            await sendTestEmailMutation.mutateAsync({ email: testEmail, orderId: cardmarketOrder.order_id });
            setTestEmailSuccess(true);
        } catch {
            // error shown via sendTestEmailMutation.isError
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
    const customerEmail = cardmarketOrder.customer.email;

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
                {!customerEmail && (
                    <Alert severity="warning" sx={{ mt: 1 }}>
                        Keine E-Mail-Adresse für diesen Kunden hinterlegt.
                    </Alert>
                )}
                {emailSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        E-Mail erfolgreich gesendet!
                    </Alert>
                )}
                {sendEmailMutation.isError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        E-Mail senden fehlgeschlagen.
                    </Alert>
                )}
                <Box sx={{ mt: 2, display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField
                        label="Test E-Mail-Adresse"
                        type="email"
                        size="small"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        sx={{ flex: 1 }}
                        inputProps={{ 'aria-label': 'Test E-Mail-Adresse' }}
                    />
                    <Button
                        onClick={handleSendTestEmail}
                        color="secondary"
                        variant="outlined"
                        disabled={!testEmail || sendTestEmailMutation.isPending}
                        startIcon={sendTestEmailMutation.isPending ? <CircularProgress size={16} /> : undefined}
                    >
                        Test E-Mail senden
                    </Button>
                </Box>
                {testEmailSuccess && (
                    <Alert severity="success" sx={{ mt: 1 }}>
                        Test-E-Mail erfolgreich gesendet!
                    </Alert>
                )}
                {sendTestEmailMutation.isError && (
                    <Alert severity="error" sx={{ mt: 1 }}>
                        Test-E-Mail senden fehlgeschlagen.
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
                <Button
                    onClick={handleSendEmail}
                    color="primary"
                    variant="contained"
                    disabled={!customerEmail || sendEmailMutation.isPending}
                    startIcon={sendEmailMutation.isPending ? <CircularProgress size={16} /> : undefined}
                >
                    Rechnung per E-Mail senden
                </Button>
                <Button onClick={handleDownload} color="primary" disabled={!invoice}>
                    Download Rechnung
                </Button>
            </DialogActions>
        </Dialog>
    );
}
