import React from 'react';
import {
    Card,
    CardHeader,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { faMoneyBillTransfer, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Refund } from '../../api/generated/Schemas';
import useDeleteRefund from '../../api/hooks/useDeleteRefund';

interface RefundItemProps {
    refund: Refund;
}

export default function RefundItem({ refund }: Readonly<RefundItemProps>) {
    const { handleDelete, loading: deleteLoading, error: deleteError } = useDeleteRefund(refund.id!);

    return (
        <Card sx={{ width: '100%', marginBottom: '0.4rem' }}>
            <CardHeader
                avatar={
                    <FontAwesomeIcon icon={faMoneyBillTransfer} size="lg" style={{ color: 'var(--color-primary)' }} />
                }
                action={
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Erstattung löschen">
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                aria-label="Erstattung löschen"
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
                        Erstattung
                    </Typography>
                }
                subheader={
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="body2" color="text.secondary">
                            {`${refund.value.toFixed(2)} €`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {String(refund.year)}
                        </Typography>
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
