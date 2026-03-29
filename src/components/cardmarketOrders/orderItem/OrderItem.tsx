import React, { useState } from 'react';
import {
    Box, Card, CardContent, CardHeader, Chip, Collapse, Stack, Tooltip, Typography,
} from '@mui/material';
import { faEnvelopeOpen, faEye, faFileInvoiceDollar, faFileLines } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CustomIconButton from '../../../customComponents/CustomIconButton';
import OrderItemContent from './OrderItemContent';
import { formatStringToDate } from '../../../helper/Utils';
import { CardmarketOrder } from '../../../api/generated/Schemas';
import PDFInvoicePreview from '../../../containers/invoices/PDFInvoicePreview'

interface OrderItemProps {
    cardmarketOrder: CardmarketOrder
}

function OrderItem({ cardmarketOrder }: Readonly<OrderItemProps>) {
    const [open, setOpen] = useState(false)
    const toggleDetails = () => setOpen(!open)
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const openInvoicePreview = () => setShowInvoicePreview(true);
    const closeInvoicePreview = () => setShowInvoicePreview(false);

    const invoiceSaved = !!cardmarketOrder.invoice;


    return (
        <Card sx={{ width: '100%', marginBottom: '0.4rem' }}>
            <CardHeader
                avatar={
                    <Box sx={{ color: 'primary.main' }}>
                        <FontAwesomeIcon icon={faFileLines} size="lg" />
                    </Box>
                }
                action={
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center">
                            <CustomIconButton
                                title="Rechnung (PDF)"
                                titleVariant="body2"
                                icon={faFileInvoiceDollar}
                                iconSize="xs"
                                onClick={openInvoicePreview}
                            />
                            <Tooltip title="Rechnung gespeichert PDF">
                                <CheckCircleOutlineIcon
                                    data-testid="pdf-invoice-ticker"
                                    sx={{ fontSize: 16, color: invoiceSaved ? 'success.main' : 'action.disabled' }}
                                />
                            </Tooltip>
                        </Stack>
                        {showInvoicePreview && <PDFInvoicePreview
                            cardmarketOrder={cardmarketOrder}
                            open={showInvoicePreview}
                            onClose={closeInvoicePreview}
                        />}
                        <Stack direction="row" alignItems="center">
                            <CustomIconButton
                                title="Rechnung (E)"
                                titleVariant="body2"
                                icon={faFileInvoiceDollar}
                                iconSize="xs"
                            />
                            <Tooltip title="Rechnung gespeichert E">
                                <CheckCircleOutlineIcon
                                    data-testid="e-invoice-ticker"
                                    sx={{ fontSize: 16, color: 'action.disabled' }}
                                />
                            </Tooltip>
                        </Stack>
                        <Stack direction="row" alignItems="center">
                            <CustomIconButton
                                title="Versenden"
                                titleVariant="body2"
                                icon={faEnvelopeOpen}
                                iconSize="xs"
                            />
                            <Tooltip title="Rechnung Versand">
                                <CheckCircleOutlineIcon
                                    data-testid="send-invoice-ticker"
                                    sx={{ fontSize: 16, color: 'action.disabled' }}
                                />
                            </Tooltip>
                        </Stack>
                    </Stack>
                }
                title={
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontWeight={600}>
                            {cardmarketOrder.customer.user_name}
                        </Typography>
                        {cardmarketOrder.customer.is_professional && (
                            <Chip
                                label="Gewerblich"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ height: 18, fontSize: '0.65rem', borderRadius: 1 }}
                            />
                        )}
                        <CustomIconButton
                            title="Öffne Bestelldetails"
                            titleVariant="body2"
                            icon={faEye}
                            iconSize="xs"
                            iconPosition="left"
                            onClick={toggleDetails}
                        />
                    </Stack>
                }
                subheader={
                    <Stack direction="row" spacing={3} sx={{ mt: 0.25 }}>
                        <Typography variant="body2" color="text.secondary">
                            {`Bezahldatum: ${formatStringToDate(cardmarketOrder.payment_date)}`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {`Bestellnummer: ${cardmarketOrder.order_id}`}
                        </Typography>
                    </Stack>
                }
                sx={{ pb: open ? 0 : undefined }}
            />
            <Collapse in={open} timeout="auto" unmountOnExit>
                <CardContent sx={{ pt: 0 }}>
                    <OrderItemContent cardmarketOrder={cardmarketOrder} />
                </CardContent>
            </Collapse>
        </Card>
    );
}

export default React.memo(OrderItem);
