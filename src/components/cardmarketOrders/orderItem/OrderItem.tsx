import React, { useState } from 'react';
import {
    Card, CardContent, CardHeader, Collapse, Stack, Typography,
} from '@mui/material';
import { faEnvelopeOpen, faFileInvoiceDollar, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CustomIconButton from '../../../customComponents/CustomIconButton';
import OrderItemContent from './OrderItemContent';
import { formatStringToDate } from '../../../helper/Utils';
import { CardmarketOrder } from '../../../api/generated/Schemas';
import PDFInvoicePreview from '../../../containers/invoices/PDFInvoicePreview'

interface OrderItemProps {
    cardmarketOrder: CardmarketOrder
}

export default function OrderItem({ cardmarketOrder }: Readonly<OrderItemProps>) {
    const [open, setOpen] = useState(false)
    const toggleDetails = () => setOpen(!open)
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const openInvoicePreview = () => setShowInvoicePreview(true);
    const closeInvoicePreview = () => setShowInvoicePreview(false);


    return (
        <Card sx={{ width: '100%', marginBottom: '0.2rem' }}>
            <CardHeader
                avatar={<FontAwesomeIcon icon={faFileLines} size="2x" />}
                action={
                    <Stack direction="row" sx={{ justifyContent: 'left' }}>
                        <CustomIconButton
                            title="Öffne Bestelldetails"
                            titleVariant="body2"
                            icon={faEnvelopeOpen}
                            iconSize="xs"
                            onClick={toggleDetails}
                        />
                        <CustomIconButton
                            title="Erstelle Rechnung (PDF)"
                            titleVariant="body2"
                            icon={faFileInvoiceDollar}
                            iconSize="xs"
                            onClick={openInvoicePreview}
                        />
                        {showInvoicePreview && <PDFInvoicePreview
                            cardmarketOrder={cardmarketOrder}
                            open={showInvoicePreview}
                            onClose={closeInvoicePreview}
                        />}
                        <CustomIconButton
                            title="Erstelle Rechnung (E)"
                            titleVariant="body2"
                            icon={faFileInvoiceDollar}
                            iconSize="xs"
                        />
                    </Stack>
                }
                title={
                    <Typography variant="body2">
                        {`Kunde: ${cardmarketOrder.customer.user_name} ${cardmarketOrder.customer.is_professional ? ' - gewerblich' : ''}`}
                    </Typography>
                }
                subheader={
                    <Stack direction="row" spacing={6}>
                        <Typography variant="body2">{`Bezahldatum: ${formatStringToDate(cardmarketOrder.payment_date)}`}</Typography>
                        <Typography variant="body2">{`Bestellnummer: ${cardmarketOrder.order_id}`}</Typography>
                    </Stack>
                }
            />
            <Collapse in={open} timeout="auto" unmountOnExit>
                <CardContent>
                    <OrderItemContent cardmarketOrder={cardmarketOrder} />
                </CardContent>
            </Collapse>
        </Card>
    );
}
