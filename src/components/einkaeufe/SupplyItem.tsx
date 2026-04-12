import React, { useState } from 'react';
import {
    Card,
    CardHeader,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { faFilePdf, faBoxOpen, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
        <Card sx={{ width: '100%', marginBottom: '0.4rem' }}>
            <CardHeader
                avatar={
                    <FontAwesomeIcon icon={faBoxOpen} size="lg" style={{ color: 'var(--color-primary)' }} />
                }
                action={
                    <Stack direction="row" alignItems="center">
                        {supply.hasPdf && (
                            <Tooltip title="PDF öffnen">
                                <IconButton size="small" onClick={handleOpenPdf} aria-label="PDF öffnen">
                                    <FontAwesomeIcon icon={faFilePdf} size="xs" />
                                </IconButton>
                            </Tooltip>
                        )}
                        <Tooltip title="Arbeitsmittel löschen">
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                aria-label="Arbeitsmittel löschen"
                                disabled={deleteLoading}
                                color="error"
                            >
                                <FontAwesomeIcon icon={faTrash} size="xs" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
                title={
                    <Typography variant="body2" fontWeight={600}>
                        {supply.description}
                    </Typography>
                }
                subheader={
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="body2" color="text.secondary">
                            {`${supply.amount.toFixed(2)} €`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {formatStringToDate(supply.date)}
                        </Typography>
                        {pdfError && (
                            <Typography variant="caption" color="error">
                                PDF konnte nicht geladen werden
                            </Typography>
                        )}
                        {deleteError && (
                            <Typography variant="caption" color="error">
                                {deleteError}
                            </Typography>
                        )}
                    </Stack>
                }
            />
        </Card>
    );
}
