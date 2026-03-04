import React, { useMemo, useState } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    CircularProgress,
    Button,
    Divider,
    Drawer,
    IconButton,
    InputAdornment,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useAtom } from 'jotai';
import { cardmarketOrdersAtom, purchaseInvoicesAtom } from '../../store/Global';
import { createPurchaseInvoice } from '../../api/generated/purchase-invoices';
import { CreatePurchaseInvoiceBody, PurchaseInvoice } from '../../api/generated/Schemas';
import { AxiosResponse } from 'axios';

interface AddPurchaseInvoiceDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function AddPurchaseInvoiceDrawer({ open, onClose }: AddPurchaseInvoiceDrawerProps) {
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom);
    const [, setPurchaseInvoices] = useAtom(purchaseInvoicesAtom);

    const konamiSets = useMemo(() => {
        const sets = new Set<string>();
        cardmarketOrders.forEach((order) =>
            order.orderItems?.forEach((item) => {
                const konamiSet = item.card?.id?.konamiSet;
                if (konamiSet) sets.add(konamiSet);
            })
        );
        return Array.from(sets).sort();
    }, [cardmarketOrders]);

    const [produktname, setProduktname] = useState<string | null>(null);
    const [anzahlDisplays, setAnzahlDisplays] = useState('');
    const [preis, setPreis] = useState('');
    const [datum, setDatum] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setProduktname(null);
        setAnzahlDisplays('');
        setPreis('');
        setDatum('');
        setPdfFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        if (selected && selected.type === 'application/pdf') {
            setPdfFile(selected);
            setError('');
        } else {
            setError('Bitte eine gültige PDF-Datei auswählen.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!produktname) {
            setError('Bitte einen Produktnamen auswählen.');
            return;
        }
        if (!pdfFile) {
            setError('Bitte eine PDF-Datei auswählen.');
            return;
        }
        const parsedAmount = parseInt(anzahlDisplays, 10);
        const parsedPrice = parseFloat(preis);
        if (isNaN(parsedAmount) || parsedAmount < 1) {
            setError('Bitte eine gültige Anzahl Displays eingeben.');
            return;
        }
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            setError('Bitte einen gültigen Preis eingeben.');
            return;
        }
        setMessage('');
        setError('');
        setLoading(true);

        const body: CreatePurchaseInvoiceBody = {
            invoiceData: {
                id: 0,
                productName: produktname,
                amount: parsedAmount,
                price: parsedPrice,
                invoiceDate: datum,
            },
            pdf: pdfFile,
        };
        try {
            const response = await createPurchaseInvoice<AxiosResponse<PurchaseInvoice>>(body);
            setPurchaseInvoices((prev) => {
                const updated = [...prev, response.data];
                return updated.sort((a, b) =>
                    new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
                );
            });
            setMessage('Einkauf erfolgreich gespeichert!');
            resetForm();
        } catch (err: unknown) {
            const msg =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
                    ? (err as { response: { data: { message: string } } }).response.data.message
                    : '';
            setError(`Speichern fehlgeschlagen.${msg ? ` ${msg}` : ''}`);
        } finally {
            setLoading(false);
        }
    };

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
                            value={produktname}
                            onChange={(_, value) => setProduktname(value)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Produktname"
                                    size="small"
                                    required
                                />
                            )}
                        />
                        <TextField
                            label="Anzahl Displays"
                            type="number"
                            value={anzahlDisplays}
                            onChange={(e) => setAnzahlDisplays(e.target.value)}
                            size="small"
                            fullWidth
                            required
                            inputProps={{ min: '1', step: '1' }}
                        />
                        <TextField
                            label="Preis"
                            type="number"
                            value={preis}
                            onChange={(e) => setPreis(e.target.value)}
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
                            value={datum}
                            onChange={(e) => setDatum(e.target.value)}
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
                                {pdfFile ? pdfFile.name : 'PDF-Rechnung auswählen'}
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
