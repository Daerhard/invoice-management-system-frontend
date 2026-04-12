import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Drawer,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useAtom } from 'jotai';
import { nachzahlungenAtom } from '../../store/Global';

interface AddNachzahlungDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function AddNachzahlungDrawer({ open, onClose }: AddNachzahlungDrawerProps) {
    const [, setNachzahlungen] = useAtom(nachzahlungenAtom);

    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setName('');
        setAmount('');
        setYear('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (!name.trim()) {
            setError('Bitte einen Namen eingeben.');
            return;
        }
        const parsedAmount = parseFloat(amount);
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            setError('Bitte einen gültigen Betrag eingeben.');
            return;
        }
        const parsedYear = parseInt(year, 10);
        if (!year || isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
            setError('Bitte ein gültiges Jahr eingeben.');
            return;
        }

        setLoading(true);
        try {
            const newEntry = {
                id: Date.now(),
                name: name.trim(),
                amount: parsedAmount,
                year: String(parsedYear),
            };
            setNachzahlungen((prev) => [newEntry, ...prev]);
            setMessage('Nachzahlung erfolgreich gespeichert!');
            resetForm();
        } finally {
            setLoading(false);
        }
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 440, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Neue Nachzahlung</Typography>
                    <IconButton onClick={onClose} aria-label="Drawer schließen" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            size="small"
                            fullWidth
                            required
                        />
                        <TextField
                            label="Betrag (€)"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            type="number"
                            inputProps={{ min: 0, step: '0.01' }}
                        />
                        <TextField
                            label="Jahr"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            type="number"
                            inputProps={{ min: 1900, max: 2100, step: 1 }}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={18} color="inherit" /> : undefined}
                        >
                            {loading ? 'Speichern…' : 'Hinzufügen'}
                        </Button>
                    </Stack>
                </Box>
                {message && (
                    <Alert severity="success" onClose={() => setMessage('')} sx={{ mt: 2 }}>
                        {message}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" onClose={() => setError('')} sx={{ mt: 2 }}>
                        {error}
                    </Alert>
                )}
            </Box>
        </Drawer>
    );
}
