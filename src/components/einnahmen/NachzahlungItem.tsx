import React from 'react';
import { Box, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import PaymentsOutlinedIcon from '@mui/icons-material/PaymentsOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
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
                    <PaymentsOutlinedIcon sx={{ fontSize: 18 }} />
                </Box>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={600} noWrap>{nachzahlung.name}</Typography>
                    <Stack direction="row" spacing={2} sx={{ mt: 0.25 }}>
                        <Typography variant="caption" color="text.secondary">
                            {nachzahlung.amount.toFixed(2)} €
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {nachzahlung.year}
                        </Typography>
                    </Stack>
                </Box>

                <Tooltip title="Nachzahlung löschen">
                    <IconButton
                        size="small"
                        onClick={handleDelete}
                        color="error"
                        aria-label="Nachzahlung löschen"
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                </Tooltip>
            </Box>
        </Box>
    );
}
