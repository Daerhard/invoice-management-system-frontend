import React from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Refund } from '../../api/generated/Schemas';
import useDeleteRefund from '../../api/hooks/useDeleteRefund';

interface RefundItemProps {
    refund: Refund;
}

export default function RefundItem({ refund }: Readonly<RefundItemProps>) {
    const { handleDelete, loading: deleteLoading, error: deleteError } = useDeleteRefund(refund.id!);

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
                '&:hover': { borderColor: 'rgba(192,57,43,0.3)' },
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.25 }}>
                <Box sx={{
                    width: 36, height: 36, borderRadius: 1.5,
                    bgcolor: 'rgba(192,57,43,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'error.main', flexShrink: 0,
                }}>
                    <CurrencyExchangeIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600}>Erstattung</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="caption" color="text.secondary">
                            {refund.value.toFixed(2)} €
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {String(refund.year)}
                        </Typography>
                        {deleteError && (
                            <Typography variant="caption" color="error">{deleteError}</Typography>
                        )}
                    </Stack>
                </Box>

                <Tooltip title="Erstattung löschen">
                    <IconButton
                        size="small"
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        color="error"
                        aria-label="Erstattung löschen"
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
