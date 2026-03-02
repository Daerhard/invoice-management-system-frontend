import React, { useState } from 'react';
import {
    Box,
    Button,
    Divider,
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
            <Stack spacing={3} width="100%">
                <Box>
                    <Typography variant="h5">Einkäufe</Typography>
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
                        <Button type="submit" variant="contained" color="primary">
                            Hinzufügen
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Box>
    );
}
