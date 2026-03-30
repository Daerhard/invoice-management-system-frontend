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
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { CardmarketOrder } from '../../api/generated/Schemas';
import { useSendInvoiceEmailMutation } from '../../queries/useSendInvoiceEmailMutation';
import { customerPageNameFilterAtom, customerPageEmailFilterAtom } from '../../store/Global';

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
    const navigate = useNavigate();
    const setCustomerNameFilter = useSetAtom(customerPageNameFilterAtom);
    const setCustomerEmailFilter = useSetAtom(customerPageEmailFilterAtom);

    const recipientEmail = cardmarketOrder.customer.email ?? null;
    const hasEmail = !!recipientEmail;
    const subject = `Bestellung ${cardmarketOrder.order_id}`;

    const handleSend = async () => {
        if (!hasEmail) return;
        setSendSuccess(false);
        try {
            await mutation.mutateAsync({
                orderId: cardmarketOrder.order_id,
                request: {
                    to: recipientEmail!,
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

    const handleNavigateToCustomer = () => {
        setCustomerNameFilter(cardmarketOrder.customer.user_name);
        setCustomerEmailFilter('without_email');
        onClose();
        navigate('/kunden');
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth data-testid="send-invoice-email-dialog">
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
                    <strong>E-Mail-Adresse:</strong> {recipientEmail ?? '–'}
                </Typography>
                {!hasEmail && (
                    <Alert severity="warning" sx={{ mt: 2 }} data-testid="no-email-warning">
                        Für diesen Kunden ist keine E-Mail-Adresse hinterlegt.
                    </Alert>
                )}
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
                {!hasEmail && (
                    <Button
                        onClick={handleNavigateToCustomer}
                        color="warning"
                        variant="outlined"
                        data-testid="navigate-to-customer-button"
                    >
                        Zum Kunden
                    </Button>
                )}
                <Button onClick={handleClose} color="secondary">
                    Abbrechen
                </Button>
                <Button
                    onClick={handleSend}
                    color="primary"
                    variant="contained"
                    disabled={!hasEmail || sendSuccess || mutation.isPending}
                    startIcon={mutation.isPending ? <CircularProgress size={16} /> : undefined}
                >
                    {sendSuccess ? 'Gesendet' : 'Senden'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
