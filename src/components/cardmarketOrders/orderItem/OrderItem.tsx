import React, { useState } from 'react';
import {
    Box, Chip, Collapse, IconButton, Stack, Tooltip, Typography,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import SendIcon from '@mui/icons-material/Send';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import OrderItemContent from './OrderItemContent';
import { formatStringToDate } from '../../../helper/Utils';
import { CardmarketOrder } from '../../../api/generated/Schemas';
import PDFInvoicePreview from '../../../containers/invoices/PDFInvoicePreview';
import SendInvoiceEmailDialog from '../../../containers/invoices/SendInvoiceEmailDialog';

interface OrderItemProps {
    cardmarketOrder: CardmarketOrder;
}

function OrderItem({ cardmarketOrder }: Readonly<OrderItemProps>) {
    const [open, setOpen] = useState(false);
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const [showEmailDialog, setShowEmailDialog] = useState(false);

    const invoiceSaved = !!cardmarketOrder.invoice;
    const invoiceSent = !!cardmarketOrder.invoice?.sent;

    return (
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
                    <ReceiptLongIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography variant="body2" fontWeight={600} noWrap>
                            {cardmarketOrder.customer.user_name}
                        </Typography>
                        {cardmarketOrder.customer.is_professional && (
                            <Chip
                                label="Gewerblich"
                                size="small"
                                color="primary"
                                variant="outlined"
                                sx={{ height: 16, fontSize: '0.6rem', borderRadius: 1 }}
                            />
                        )}
                        {invoiceSent ? (
                            <Chip
                                label="Versendet"
                                size="small"
                                color="success"
                                sx={{ height: 16, fontSize: '0.6rem', borderRadius: 1 }}
                            />
                        ) : invoiceSaved ? (
                            <Chip
                                label="Rechnung erstellt"
                                size="small"
                                color="warning"
                                sx={{ height: 16, fontSize: '0.6rem', borderRadius: 1 }}
                            />
                        ) : null}
                    </Stack>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="caption" color="text.secondary">
                            {formatStringToDate(cardmarketOrder.payment_date)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            #{cardmarketOrder.order_id}
                        </Typography>
                        <Typography variant="caption" fontWeight={600} color="primary.main">
                            {cardmarketOrder.total_value} {cardmarketOrder.currency}
                        </Typography>
                    </Stack>
                </Box>

                <Stack direction="row" alignItems="center" spacing={0.25} flexShrink={0}>
                    <Tooltip title={invoiceSaved ? 'Rechnung PDF (gespeichert)' : 'Rechnung PDF erstellen'}>
                        <IconButton
                            size="small"
                            onClick={() => setShowInvoicePreview(true)}
                            sx={{ color: invoiceSaved ? 'success.main' : 'text.secondary' }}
                            aria-label="Rechnung PDF"
                        >
                            <PictureAsPdfIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="E-Rechnung (nicht verfügbar)">
                        <span>
                            <IconButton size="small" disabled aria-label="E-Rechnung">
                                <ArticleOutlinedIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title={
                        !cardmarketOrder.customer.is_professional
                            ? 'Nur für gewerbliche Kunden'
                            : invoiceSent
                                ? 'Rechnung bereits versendet'
                                : 'Rechnung per E-Mail senden'
                    }>
                        <span>
                            <IconButton
                                size="small"
                                onClick={cardmarketOrder.customer.is_professional ? () => setShowEmailDialog(true) : undefined}
                                disabled={!cardmarketOrder.customer.is_professional}
                                sx={{ color: invoiceSent ? 'success.main' : 'text.secondary' }}
                                aria-label="E-Mail senden"
                            >
                                <SendIcon sx={{ fontSize: 18 }} />
                            </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip title={open ? 'Details ausblenden' : 'Details anzeigen'}>
                        <IconButton size="small" onClick={() => setOpen(!open)} aria-label="Details">
                            <KeyboardArrowDownIcon
                                sx={{
                                    fontSize: 18,
                                    transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease',
                                }}
                            />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>

            {showInvoicePreview && (
                <PDFInvoicePreview
                    cardmarketOrder={cardmarketOrder}
                    open={showInvoicePreview}
                    onClose={() => setShowInvoicePreview(false)}
                />
            )}
            {showEmailDialog && (
                <SendInvoiceEmailDialog
                    cardmarketOrder={cardmarketOrder}
                    open={showEmailDialog}
                    onClose={() => setShowEmailDialog(false)}
                />
            )}

            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ px: 2, pb: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#FAFAF8' }}>
                    <OrderItemContent cardmarketOrder={cardmarketOrder} />
                </Box>
            </Collapse>
        </Box>
    );
}

export default React.memo(OrderItem);
