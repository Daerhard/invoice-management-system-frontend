import React, { useState } from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { Supply } from '../../api/generated/Schemas';
import { formatStringToDate } from '../../helper/Utils';
import { getSupplyPdf } from '../../api/generated/supplies';
import useDeleteSupply from '../../api/hooks/useDeleteSupply';

interface SupplyItemProps {
    supply: Supply;
}

export default function SupplyItem({ supply }: Readonly<SupplyItemProps>) {
    const [pdfError, setPdfError] = useState(false);
    const { handleDelete, loading: deleteLoading, error: deleteError } = useDeleteSupply(supply.id!);

    const handleOpenPdf = async () => {
        setPdfError(false);
        try {
            const response = await getSupplyPdf(supply.id!);
            const url = URL.createObjectURL(response.data);
            window.open(url, '_blank');
        } catch {
            setPdfError(true);
        }
    };

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
                    <Inventory2OutlinedIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{supply.product}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="caption" color="text.secondary">
                            {supply.value.toFixed(2)} €
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {formatStringToDate(supply.supplyDate)}
                        </Typography>
                        {pdfError && <Typography variant="caption" color="error">PDF nicht verfügbar</Typography>}
                        {deleteError && <Typography variant="caption" color="error">{deleteError}</Typography>}
                    </Stack>
                </Box>

                <Stack direction="row" alignItems="center" spacing={0.25} flexShrink={0}>
                    <Tooltip title="PDF öffnen">
                        <IconButton size="small" onClick={handleOpenPdf} aria-label="PDF öffnen">
                            <PictureAsPdfIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Arbeitsmittel löschen">
                        <IconButton
                            size="small"
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            color="error"
                            aria-label="Arbeitsmittel löschen"
                        >
                            <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                    </Tooltip>
                </Stack>
            </Box>
        </Box>
    );
}
