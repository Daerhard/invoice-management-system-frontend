import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { ImportCSVDataBody } from '../../api/generated/Schemas'
import { importCSVData } from '../../api/generated/csvimport'


const CSVImportComponent = () => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files ? e.target.files[0] : null;
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setError('');
        } else {
            setError('Bitte eine gültige CSV-Datei auswählen.');
        }
    };

    const handleImportCSV = async () => {
        if (!file) {
            setError('Bitte zuerst eine CSV-Datei auswählen.');
            return;
        }

        setMessage('');
        setError('');
        setLoading(true);
        const formData: ImportCSVDataBody = {
            file: file
        };

        try {
            await importCSVData(formData);

            setLoading(false);
            setMessage('Datei erfolgreich importiert!');
        } catch (err) {
            setLoading(false);

            const errorMessage = extractErrorMessage(err);
            setError(`Import fehlgeschlagen.${errorMessage ? ` ${errorMessage}` : ''}`);
        }
    };

    const extractErrorMessage = (err: any): string => {
        if (
            typeof err === "object" &&
            err !== null &&
            "response" in err &&
            typeof err.response === "object" &&
            err.response?.data?.message
        ) {
            return err.response.data.message;
        }
        return "";
    };

    const errorLines = error ? error.split('\n').filter(line => line.trim()) : [];

    return (
        <Box sx={{ maxWidth: 600 }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h5" gutterBottom>
                        CSV-Import
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Importieren Sie Bestelldaten aus einer CSV-Datei in das System.
                        Stellen Sie sicher, dass die Datei dem erwarteten Format entspricht.
                    </Typography>
                </Box>

                <Card variant="outlined">
                    <CardContent>
                        <Stack spacing={2}>
                            <Typography variant="subtitle2" color="text.secondary">
                                CSV-Datei auswählen
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
                                    sx={{
                                        fontSize: 40,
                                        color: file ? 'primary.main' : 'text.disabled',
                                        mb: 1,
                                    }}
                                />
                                <Typography variant="body2" color={file ? 'primary.main' : 'text.secondary'}>
                                    {file ? file.name : 'Klicken zum Auswählen einer Datei'}
                                </Typography>
                                <Typography variant="caption" color="text.disabled">
                                    Nur CSV-Dateien werden unterstützt
                                </Typography>
                            </Box>

                            <Divider />

                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleImportCSV}
                                disabled={loading || !file}
                                startIcon={loading ? <CircularProgress size={18} color="inherit" /> : <UploadFileIcon />}
                            >
                                {loading ? 'Importiere…' : 'CSV importieren'}
                            </Button>
                        </Stack>
                    </CardContent>
                </Card>

                {message && (
                    <Alert severity="success" onClose={() => setMessage('')}>
                        {message}
                    </Alert>
                )}

                {error && (
                    <Alert severity="error" onClose={() => setError('')}>
                        <Typography variant="subtitle2" gutterBottom={errorLines.length > 1}>
                            {errorLines[0]}
                        </Typography>
                        {errorLines.length > 1 && (
                            <List dense disablePadding sx={{ mt: 0.5 }}>
                                {errorLines.slice(1).map((line, idx) => (
                                    <ListItem key={`${idx}-${line}`} disableGutters sx={{ py: 0 }}>
                                        <ListItemIcon sx={{ minWidth: 28 }}>
                                            <ErrorOutlineIcon fontSize="small" color="error" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={line}
                                            primaryTypographyProps={{ variant: 'body2' }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Alert>
                )}
            </Stack>
        </Box>
    );
};

export default CSVImportComponent;
