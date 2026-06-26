import React, { useState } from 'react';
import {
    Box, Collapse, Divider, Grid2, IconButton, List, ListItem, ListItemText,
    Stack, Tooltip, Typography,
} from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { CardmarketPurchase } from '../../api/generated/Schemas';
import { formatStringToDate } from '../../helper/Utils';

interface CardmarketPurchaseItemProps {
    purchase: CardmarketPurchase;
}

function CardmarketPurchaseItem({ purchase }: Readonly<CardmarketPurchaseItemProps>) {
    const [open, setOpen] = useState(false);
    const items = purchase.purchaseItems ?? [];

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
                    <ShoppingBagOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>
                        {purchase.sellerUserName}
                    </Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="caption" color="text.secondary">
                            {formatStringToDate(purchase.dateOfPayment)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            #{purchase.externalOrderId}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {purchase.articleCount} Artikel
                        </Typography>
                        <Typography variant="caption" fontWeight={600} color="error.main">
                            {purchase.totalValue.toFixed(2)} {purchase.currency}
                        </Typography>
                    </Stack>
                </Box>

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
            </Box>

            <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ px: 2, pb: 2, pt: 1.5, borderTop: '1px solid', borderColor: 'divider', bgcolor: '#FAFAF8' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>Gekaufte Karten</Typography>
                    <List dense disablePadding>
                        {items.map((item, index) => (
                            <ListItem key={index} disableGutters sx={{ py: 0.25 }}>
                                <ListItemText
                                    primary={`${item.count}x ${item.card.name} (${item.card.id.konamiSet}) – ${item.card.id.number} – ${item.card.rarity} – ${item.condition}${item.isFirstEdition ? ' – 1st Ed.' : ''} – ${item.price.toFixed(2)} ${purchase.currency}`}
                                    primaryTypographyProps={{ variant: 'body2' }}
                                />
                            </ListItem>
                        ))}
                        {items.length === 0 && (
                            <Typography variant="body2" color="text.secondary">Keine Artikel vorhanden.</Typography>
                        )}
                    </List>
                    <Divider sx={{ my: 1.5 }} />
                    <Grid2 container spacing={4}>
                        <Grid2>
                            <Typography variant="body2" color="text.secondary">Warenwert</Typography>
                            <Typography variant="body2" fontWeight={600}>{purchase.merchandiseValue.toFixed(2)} {purchase.currency}</Typography>
                        </Grid2>
                        <Grid2>
                            <Typography variant="body2" color="text.secondary">Versandkosten</Typography>
                            <Typography variant="body2" fontWeight={600}>{purchase.shipmentCost.toFixed(2)} {purchase.currency}</Typography>
                        </Grid2>
                        <Grid2>
                            <Typography variant="body2" color="text.secondary">Treuhändergebühr</Typography>
                            <Typography variant="body2" fontWeight={600}>{purchase.trusteeFee.toFixed(2)} {purchase.currency}</Typography>
                        </Grid2>
                        <Grid2>
                            <Typography variant="body2" color="text.secondary">Gesamtpreis</Typography>
                            <Typography variant="body2" fontWeight={600} color="error.main">{purchase.totalValue.toFixed(2)} {purchase.currency}</Typography>
                        </Grid2>
                    </Grid2>
                </Box>
            </Collapse>
        </Box>
    );
}

export default React.memo(CardmarketPurchaseItem);
