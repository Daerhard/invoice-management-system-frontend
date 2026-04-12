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
import UploadFileIcon from '@mui/icons-material/UploadFile';
import useAddSupplyForm from '../../api/hooks/useAddSupplyForm';

interface AddSupplyDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function AddSupplyDrawer({ open, onClose }: AddSupplyDrawerProps) {
    const {
        description,
        setDescription,
        amount,
        setAmount,
        date,
        setDate,
        pdfFile,
        loading,
        message,
        setMessage,
        error,
        setError,
        handleFileChange,
        handleSubmit,
    } = useAddSupplyForm();

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 440, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Neues Arbeitsmittel</Typography>
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
                            label="Datum"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                        <Box
                            component="label"
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                border: '2px dashed',
                                borderColor: pdfFile ? 'primary.main' : 'divider',
                                borderRadius: 1,
                                p: 2,
                                textAlign: 'center',
                                cursor: 'pointer',
                                bgcolor: pdfFile ? 'action.hover' : 'background.default',
                                '&:hover': { borderColor: 'primary.main' },
                            }}
                        >
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                            <UploadFileIcon
                                sx={{
                                    fontSize: 32,
                                    color: pdfFile ? 'primary.main' : 'text.disabled',
                                    mb: 0.5,
                                }}
                            />
                            <Typography variant="body2" color={pdfFile ? 'primary.main' : 'text.secondary'}>
                                {pdfFile ? pdfFile.name : 'PDF-Rechnung auswählen (optional)'}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">
                                Nur PDF-Dateien werden unterstützt
                            </Typography>
                        </Box>
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
