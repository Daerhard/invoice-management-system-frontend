import React, { useState } from 'react';
import {
    Alert,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Typography,
} from '@mui/material';
import { CardmarketOrder } from '../../api/generated/Schemas';
import { useSendInvoiceEmailMutation } from '../../queries/useSendInvoiceEmailMutation';

// TODO: Hardcoded test-only email address – remove once the customer email is reliably stored in the backend.
// The customer email from the order is used when available; this address is only a testing fallback.
const TESTING_FALLBACK_EMAIL = 'Erhard-daniel-gew@gmx.de';

interface SendInvoiceEmailDialogProps {
    cardmarketOrder: CardmarketOrder;
    open: boolean;
    onClose: () => void;
}

export default function SendInvoiceEmailDialog({
    cardmarketOrder,
    open,
    onClose,
}: Readonly<SendInvoiceEmailDialogProps>) {
    const mutation = useSendInvoiceEmailMutation();
    const [sendSuccess, setSendSuccess] = useState(false);

    const recipientEmail = cardmarketOrder.customer.email ?? TESTING_FALLBACK_EMAIL;
    const subject = `Bestellung ${cardmarketOrder.order_id}`;

    const handleSend = async () => {
        setSendSuccess(false);
        try {
            await mutation.mutateAsync({
                orderId: cardmarketOrder.order_id,
                request: {
                    to: recipientEmail,
                    subject,
                },
            });
            setSendSuccess(true);
        } catch {
            // error shown via mutation.isError
        }
    };

    const handleClose = () => {
        mutation.reset();
        setSendSuccess(false);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Rechnung per E-Mail senden</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Soll die Rechnung für folgende Bestellung per E-Mail gesendet werden?
                </DialogContentText>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Kunde:</strong> {cardmarketOrder.customer.user_name}
                </Typography>
                <Typography variant="body2">
                    <strong>Bestellnummer:</strong> {cardmarketOrder.order_id}
                </Typography>
                <Typography variant="body2">
                    <strong>E-Mail-Adresse:</strong> {recipientEmail}
                </Typography>
                {sendSuccess && (
                    <Alert severity="success" sx={{ mt: 2 }}>
                        E-Mail erfolgreich gesendet!
                    </Alert>
                )}
                {mutation.isError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {(mutation.error as { response?: { data?: { message?: string } } })?.response?.data?.message
                            ?? 'E-Mail konnte nicht gesendet werden.'}
                    </Alert>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Abbrechen
                </Button>
                <Button
                    onClick={handleSend}
                    color="primary"
                    variant="contained"
                    disabled={sendSuccess || mutation.isPending}
                    startIcon={mutation.isPending ? <CircularProgress size={16} /> : undefined}
                >
                    {sendSuccess ? 'Gesendet' : 'Senden'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
