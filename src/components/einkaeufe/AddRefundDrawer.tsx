import React from 'react';
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
import useAddRefundForm from '../../api/hooks/useAddRefundForm';

interface AddRefundDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function AddRefundDrawer({ open, onClose }: AddRefundDrawerProps) {
    const {
        description,
        setDescription,
        amount,
        setAmount,
        year,
        setYear,
        loading,
        message,
        setMessage,
        error,
        setError,
        handleSubmit,
    } = useAddRefundForm();

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 440, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Neue Erstattung</Typography>
                    <IconButton onClick={onClose} aria-label="Drawer schließen" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Beschreibung"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
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
