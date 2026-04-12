import React, { useState } from 'react';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AddIcon from '@mui/icons-material/Add';

interface EuerEntry {
    year: number;
}

const CURRENT_YEAR = new Date().getFullYear();
const YEAR_RANGE_SIZE = 10;
const YEAR_OPTIONS = Array.from({ length: YEAR_RANGE_SIZE }, (_, i) => CURRENT_YEAR - i);

export default function Euer() {
    const [entries, setEntries] = useState<EuerEntry[]>([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedYear, setSelectedYear] = useState<number>(CURRENT_YEAR);

    const handleAdd = () => {
        if (entries.some((e) => e.year === selectedYear)) {
            return;
        }
        setEntries((prev) => {
            const next = [...prev, { year: selectedYear }];
            next.sort((a, b) => b.year - a.year);
            return next;
        });
        setDialogOpen(false);
    };

    const handleOpenDialog = () => {
        const nextYear = YEAR_OPTIONS.find((y) => !entries.some((e) => e.year === y)) ?? CURRENT_YEAR;
        setSelectedYear(nextYear);
        setDialogOpen(true);
    };

    const alreadyExists = entries.some((e) => e.year === selectedYear);

    return (
        <Box style={{ width: '100%' }}>
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <ReceiptLongIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h5">EÜR</Typography>
                            {entries.length > 0 && (
                                <Chip
                                    label={entries.length}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600, borderRadius: 1 }}
                                />
                            )}
                        </Stack>
                        <Tooltip title="Neue EÜR anlegen">
                            <IconButton
                                color="primary"
                                size="small"
                                onClick={handleOpenDialog}
                                aria-label="Neue EÜR anlegen"
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Einnahmen-Überschuss-Rechnung je Kalenderjahr
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>

                <List dense disablePadding>
                    {entries.length > 0 ? (
                        entries.map((entry) => (
                            <ListItem key={entry.year} divider>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" fontWeight={600}>
                                            EÜR {entry.year}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Noch keine EÜR vorhanden. Legen Sie eine neue EÜR an.
                        </Typography>
                    )}
                </List>
            </Stack>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Neue EÜR anlegen</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Jahr"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            size="small"
                            fullWidth
                            inputProps={{ 'aria-label': 'Jahr auswählen' }}
                            error={alreadyExists}
                            helperText={alreadyExists ? 'Für dieses Jahr existiert bereits eine EÜR.' : ''}
                        >
                            {YEAR_OPTIONS.map((year) => (
                                <MenuItem key={year} value={year}>
                                    {year}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Abbrechen</Button>
                    <Button variant="contained" onClick={handleAdd} disabled={alreadyExists}>
                        Anlegen
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
