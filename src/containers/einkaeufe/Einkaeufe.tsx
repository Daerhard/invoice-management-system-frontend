import React, { useState } from 'react';
import {
    Box,
    Button,
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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useAtom } from 'jotai';
import { einkaeufeAtom, Einkauf } from '../../store/Global';
import { formatStringToDate } from '../../helper/Utils';

export default function Einkaeufe() {
    const [einkaeufe, setEinkaeufe] = useAtom(einkaeufeAtom);
    const [produktname, setProduktname] = useState('');
    const [anzahlDisplays, setAnzahlDisplays] = useState('');
    const [preis, setPreis] = useState('');
    const [datum, setDatum] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAnzahl = parseInt(anzahlDisplays, 10);
        const parsedPreis = parseFloat(preis);
        if (!Number.isFinite(parsedAnzahl) || !Number.isFinite(parsedPreis)) {
            return;
        }
        const neuerEinkauf: Einkauf = {
            id: Date.now() + Math.random(),
            produktname,
            anzahlDisplays: parsedAnzahl,
            preis: parsedPreis,
            datum,
        };
        setEinkaeufe((prev) => [...prev, neuerEinkauf]);
        setProduktname('');
        setAnzahlDisplays('');
        setPreis('');
        setDatum('');
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
                        <Button type="submit" variant="contained" color="primary">
                            Hinzufügen
                        </Button>
                    </Stack>
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
                )}
            </Stack>
        </Box>
    );
}
