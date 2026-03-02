import React, { useState } from 'react';
import {
    Box,
    Button,
    Grid2,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

export default function Einkaeufe() {
    const [produktname, setProduktname] = useState('');
    const [menge, setMenge] = useState('');
    const [preis, setPreis] = useState('');
    const [datum, setDatum] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Placeholder: backend integration not yet implemented
    };

    return (
        <Box style={{ width: '100%' }}>
            <Stack spacing={4} width="100%">
                <Grid2 container direction="row" justifyContent="space-between" alignItems="center" marginBottom="0.5rem">
                    <Typography variant="h6">Einkäufe</Typography>
                </Grid2>
                <Box component="form" onSubmit={handleSubmit}>
                    <Stack spacing={2} maxWidth={400}>
                        <TextField
                            label="Produktname"
                            value={produktname}
                            onChange={(e) => setProduktname(e.target.value)}
                            size="small"
                            fullWidth
                        />
                        <TextField
                            label="Menge"
                            type="number"
                            value={menge}
                            onChange={(e) => setMenge(e.target.value)}
                            size="small"
                            fullWidth
                            inputProps={{ min: '1', step: '1' }}
                        />
                        <TextField
                            label="Preis"
                            type="number"
                            value={preis}
                            onChange={(e) => setPreis(e.target.value)}
                            size="small"
                            fullWidth
                            inputProps={{ min: '0', step: '0.01' }}
                        />
                        <TextField
                            label="Datum"
                            type="date"
                            value={datum}
                            onChange={(e) => setDatum(e.target.value)}
                            size="small"
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                        <Button type="submit" variant="contained" sx={{ backgroundColor: '#C28840' }}>
                            Hinzufügen
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
