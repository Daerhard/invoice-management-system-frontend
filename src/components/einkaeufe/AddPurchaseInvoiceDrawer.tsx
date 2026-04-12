import React from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    CircularProgress,
    Button,
    Divider,
    Drawer,
    IconButton,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import usePurchaseInvoiceForm from '../../api/hooks/usePurchaseInvoiceForm';

interface AddPurchaseInvoiceDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function AddPurchaseInvoiceDrawer({ open, onClose }: AddPurchaseInvoiceDrawerProps) {
    const {
        konamiSets,
        produktname,
        setProduktname,
        loading,
        message,
        setMessage,
        error,
        setError,
        handleSubmit,
    } = usePurchaseInvoiceForm();

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 440, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Neuer Einkauf</Typography>
                    <IconButton onClick={onClose} aria-label="Drawer schließen" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <Autocomplete
                            options={konamiSets}
                            value={produktname || null}
                            onChange={(_event, newValue) => setProduktname(newValue ?? '')}
                            freeSolo
                            onInputChange={(_event, newInputValue) => setProduktname(newInputValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Produktname"
                                    size="small"
                                    fullWidth
                                    required
                                />
                            )}
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
