import React, { useState } from 'react';
import {
    Alert, Box, Button, CircularProgress, Divider, Drawer,
    IconButton, Stack, Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { useImportPurchasesMutation } from '../../queries/useImportPurchasesMutation';
import { extractErrorMessage } from '../../helper/Utils';

interface ImportPurchasesDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function ImportPurchasesDrawer({ open, onClose }: ImportPurchasesDrawerProps) {
    const [file, setFile] = useState<File | null>(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const importMutation = useImportPurchasesMutation();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        if (selected && (selected.type === 'text/csv' || selected.name.endsWith('.csv'))) {
            setFile(selected);
            setError('');
        } else {
            setError('Bitte eine gültige CSV-Datei auswählen.');
        }
    };

    const handleImport = () => {
        if (!file) {
            setError('Bitte zuerst eine CSV-Datei auswählen.');
            return;
        }
        setMessage('');
        setError('');
        importMutation.mutate(
            { file },
            {
                onSuccess: () => {
                    setMessage('Datei erfolgreich importiert!');
                    setFile(null);
                },
                onError: (err) => {
                    const msg = extractErrorMessage(err);
                    setError(`Import fehlgeschlagen.${msg ? ` ${msg}` : ''}`);
                },
            }
        );
    };

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 480, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Karteneinkäufe importieren</Typography>
                    <IconButton onClick={onClose} aria-label="Drawer schließen" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={3}>
                    <Typography variant="body2" color="text.secondary">
                        Importieren Sie Karteneinkäufe aus einer Cardmarket CSV-Datei.
                    </Typography>
                    <Box
                        component="label"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            border: '2px dashed',
                            borderColor: file ? 'primary.main' : 'divider',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            cursor: 'pointer',
                            bgcolor: file ? 'action.hover' : 'background.default',
                            '&:hover': { borderColor: 'primary.main' },
                        }}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                        <UploadFileIcon
                            sx={{ fontSize: 40, color: file ? 'primary.main' : 'text.disabled', mb: 1 }}
                        />
                        <Typography variant="body2" color={file ? 'primary.main' : 'text.secondary'}>
                            {file ? file.name : 'Klicken zum Auswählen einer Datei'}
                        </Typography>
                        <Typography variant="caption" color="text.disabled">
                            Nur CSV-Dateien werden unterstützt
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleImport}
                        disabled={importMutation.isPending || !file}
                        startIcon={importMutation.isPending ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
                    >
                        {importMutation.isPending ? 'Importiere…' : 'CSV importieren'}
                    </Button>
                    {message && (
                        <Alert severity="success" onClose={() => setMessage('')}>{message}</Alert>
                    )}
                    {error && (
                        <Alert severity="error" onClose={() => setError('')}>{error}</Alert>
                    )}
                </Stack>
            </Box>
        </Drawer>
    );
}
