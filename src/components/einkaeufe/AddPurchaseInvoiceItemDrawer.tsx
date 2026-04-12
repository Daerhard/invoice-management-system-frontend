import React from 'react';
import {
    Alert,
    Box,
    CircularProgress,
    Button,
    Divider,
    Drawer,
    IconButton,
    InputAdornment,
    MenuItem,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import useAddPurchaseInvoiceItemForm from '../../api/hooks/useAddPurchaseInvoiceItemForm';
import { PurchaseInvoiceItemPurchaseType } from '../../api/generated/Schemas';

interface AddPurchaseInvoiceItemDrawerProps {
    open: boolean;
    onClose: () => void;
    invoiceId: number;
    invoiceName: string;
}

const PURCHASE_TYPE_LABELS: Record<PurchaseInvoiceItemPurchaseType, string> = {
    DISPLAY: 'Display',
    CASE: 'Case',
    BOOSTER: 'Booster',
};

export default function AddPurchaseInvoiceItemDrawer({
    open,
    onClose,
    invoiceId,
    invoiceName,
}: AddPurchaseInvoiceItemDrawerProps) {
    const {
        purchaseType,
        setPurchaseType,
        amount,
        setAmount,
        price,
        setPrice,
        invoiceDate,
        setInvoiceDate,
        pdfFile,
        loading,
        message,
        setMessage,
        error,
        setError,
        handleFileChange,
        handleSubmit,
    } = useAddPurchaseInvoiceItemForm(invoiceId);

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 440, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Position hinzufügen</Typography>
                    <IconButton onClick={onClose} aria-label="Drawer schließen" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {invoiceName}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="Typ"
                            value={purchaseType}
                            onChange={(e) => setPurchaseType(e.target.value as PurchaseInvoiceItemPurchaseType)}
                            size="small"
                            fullWidth
                            required
                        >
                            {Object.values(PurchaseInvoiceItemPurchaseType).map((type) => (
                                <MenuItem key={type} value={type}>
                                    {PURCHASE_TYPE_LABELS[type]}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Anzahl"
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            inputProps={{ min: '1', step: '1' }}
                        />
                        <TextField
                            label="Preis"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            inputProps={{ min: '0', step: '0.01' }}
                            InputProps={{
                                endAdornment: <InputAdornment position="end">€</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Datum"
                            type="date"
                            value={invoiceDate}
                            onChange={(e) => setInvoiceDate(e.target.value)}
                            size="small"
                            fullWidth
                            required
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
                            {loading ? 'Speichern…' : 'Position hinzufügen'}
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
