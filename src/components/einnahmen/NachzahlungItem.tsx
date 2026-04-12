import React from 'react';
import {
    Card,
    CardHeader,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { faMoneyBillWave, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAtom } from 'jotai';
import { nachzahlungenAtom, Nachzahlung } from '../../store/Global';

interface NachzahlungItemProps {
    nachzahlung: Nachzahlung;
}

export default function NachzahlungItem({ nachzahlung }: Readonly<NachzahlungItemProps>) {
    const [, setNachzahlungen] = useAtom(nachzahlungenAtom);

    const handleDelete = () => {
        setNachzahlungen((prev) => prev.filter((n) => n.id !== nachzahlung.id));
    };

    return (
        <Card sx={{ width: '100%', marginBottom: '0.4rem' }}>
            <CardHeader
                avatar={
                    <FontAwesomeIcon icon={faMoneyBillWave} size="lg" style={{ color: 'var(--color-primary)' }} />
                }
                action={
                    <Stack direction="row" alignItems="center">
                        <Tooltip title="Nachzahlung löschen">
                            <IconButton
                                size="small"
                                onClick={handleDelete}
                                aria-label="Nachzahlung löschen"
                                color="error"
                            >
                                <FontAwesomeIcon icon={faTrash} size="xs" />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                }
                title={
                    <Typography variant="body2" fontWeight={600}>
                        {nachzahlung.name}
                    </Typography>
                }
                subheader={
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="body2" color="text.secondary">
                            {`${nachzahlung.amount.toFixed(2)} €`}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {nachzahlung.year}
                        </Typography>
                    </Stack>
                }
            />
        </Card>
    );
}
