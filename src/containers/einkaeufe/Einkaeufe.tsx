import React, { useMemo, useState } from 'react';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    CircularProgress,
    Divider,
    InputAdornment,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Dayjs } from 'dayjs';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAtom } from 'jotai';
import { einkaeufeAtom, Einkauf } from '../../store/Global';
import { formatStringToDate } from '../../helper/Utils';

import UploadFileIcon from '@mui/icons-material/UploadFile';
import { createPurchaseInvoice } from '../../api/generated/purchase-invoices';
import { CreatePurchaseInvoiceBody } from '../../api/generated/Schemas';
import { cardmarketOrdersAtom } from '../../store/Global';
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders';

export default function Einkaeufe() {
    const [einkaeufe, setEinkaeufe] = useAtom(einkaeufeAtom);
    const [produktname, setProduktname] = useState('');
    const [anzahlDisplays, setAnzahlDisplays] = useState('');
    const [preis, setPreis] = useState('');
    const [datum, setDatum] = useState<Dayjs | null>(null);
    useCardmarketOrders();

    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom);

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
        const parsedAnzahl = parseInt(anzahlDisplays, 10);
        const parsedPreis = parseFloat(preis);
        if (!Number.isFinite(parsedAnzahl) || !Number.isFinite(parsedPreis) || !datum) {
            return;
        }
        const neuerEinkauf: Einkauf = {
            id: Date.now() + Math.random(),
            produktname,
            anzahlDisplays: parsedAnzahl,
            preis: parsedPreis,
            datum: datum.format('YYYY-MM-DD'),
        };
        setEinkaeufe((prev) => [...prev, neuerEinkauf]);
        setProduktname('');
        setAnzahlDisplays('');
        setPreis('');
        setDatum(null);
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
            productName: produktname,
            amount: parsedAmount,
            price: parsedPrice,
            invoiceDate: datum,
            pdf: pdfFile,
        };
        try {
            await createPurchaseInvoice(body);
            setMessage('Einkauf erfolgreich gespeichert!');
            setProduktname(null);
            setAnzahlDisplays('');
            setPreis('');
            setDatum('');
            setPdfFile(null);
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
        <Box style={{ width: '100%' }}>
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <ShoppingCartIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5">Einkäufe</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Einkäufe manuell erfassen und verwalten
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>
                <Box component="form" onSubmit={handleSubmit}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2} maxWidth={400}>
                            <TextField
                                label="Produktname"
                                value={produktname}
                                onChange={(e) => setProduktname(e.target.value)}
                                size="small"
                                fullWidth
                                required
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
                                    startAdornment: <InputAdornment position="start">€</InputAdornment>,
                                }}
                            />
                            <DatePicker
                                label="Datum"
                                value={datum}
                                onChange={(newValue) => setDatum(newValue)}
                                format="DD.MM.YYYY"
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                        required: true,
                                    },
                                }}
                            />
                            <Button type="submit" variant="contained" color="primary">
                                Hinzufügen
                            </Button>
                        </Stack>
                    </LocalizationProvider>
                </Box>
                {einkaeufe.length > 0 && (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            Erfasste Einkäufe
                        </Typography>
                        <TableContainer component={Paper} variant="outlined">
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Produktname</TableCell>
                                        <TableCell align="right">Anzahl Displays</TableCell>
                                        <TableCell align="right">Preis (€)</TableCell>
                                        <TableCell align="right">Datum</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {einkaeufe.map((einkauf) => (
                                        <TableRow key={einkauf.id}>
                                            <TableCell>{einkauf.produktname}</TableCell>
                                            <TableCell align="right">{einkauf.anzahlDisplays}</TableCell>
                                            <TableCell align="right">{einkauf.preis.toFixed(2)}</TableCell>
                                            <TableCell align="right">{formatStringToDate(einkauf.datum)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                    <Stack spacing={2} maxWidth={400}>
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
                    <Alert severity="success" onClose={() => setMessage('')}>
                        {message}
                    </Alert>
                )}
                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}
            </Stack>
        </Box>
    );
}
