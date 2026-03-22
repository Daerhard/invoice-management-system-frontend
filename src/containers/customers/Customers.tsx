import React, { useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    Snackbar,
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
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useProfessionalCustomersQuery } from '../../queries/useProfessionalCustomersQuery';
import { useUpdateCustomerEmailMutation } from '../../queries/useUpdateCustomerEmailMutation';
import { Customer } from '../../api/generated/Schemas';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

interface CustomerRowProps {
    customer: Customer;
    onNotify: (message: string, severity: 'success' | 'error') => void;
}

function CustomerRow({ customer, onNotify }: CustomerRowProps) {
    const [emailInput, setEmailInput] = useState(customer.email ?? '');

    const mutation = useUpdateCustomerEmailMutation();

    const isValidEmail = EMAIL_REGEX.test(emailInput);
    const isUnchanged = emailInput === (customer.email ?? '');
    const isSaveDisabled = !isValidEmail || isUnchanged || mutation.isPending;

    const handleSave = () => {
        mutation.mutate(
            { userName: customer.user_name, email: emailInput },
            {
                onSuccess: () => onNotify('E-Mail erfolgreich gespeichert.', 'success'),
                onError: () => onNotify('E-Mail konnte nicht gespeichert werden.', 'error'),
            }
        );
    };

    return (
        <TableRow hover>
            <TableCell>{customer.user_name}</TableCell>
            <TableCell>
                {customer.is_professional ? (
                    <Chip label="Ja" color="success" size="small" />
                ) : (
                    <Chip label="Nein" size="small" />
                )}
            </TableCell>
            <TableCell>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        type="email"
                        placeholder="E-Mail hinzufügen"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        error={emailInput.length > 0 && !isValidEmail}
                        helperText={emailInput.length > 0 && !isValidEmail ? 'Ungültige E-Mail-Adresse' : ''}
                        sx={{ minWidth: 240 }}
                        inputProps={{ 'aria-label': `E-Mail für ${customer.user_name}` }}
                    />
                    <Button
                        variant="contained"
                        size="small"
                        disabled={isSaveDisabled}
                        onClick={handleSave}
                        aria-label={`E-Mail für ${customer.user_name} speichern`}
                    >
                        {mutation.isPending ? <CircularProgress size={18} color="inherit" /> : 'Speichern'}
                    </Button>
                </Stack>
            </TableCell>
        </TableRow>
    );
}

export default function Customers() {
    const { data, isLoading, isError } = useProfessionalCustomersQuery();
    const customers = data?.data ?? [];

    const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });

    const handleNotify = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Box style={{ width: '100%' }}>
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <PeopleAltIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5">Kunden</Typography>
                        {customers.length > 0 && (
                            <Chip
                                label={customers.length}
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 600, borderRadius: 1 }}
                            />
                        )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Übersicht aller professionellen Kunden
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>

                {isLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {isError && (
                            <Alert severity="error">
                                Kundendaten konnten nicht geladen werden.
                            </Alert>
                        )}
                        {customers.length === 0 && !isError ? (
                            <Typography variant="body2" color="text.secondary">
                                Keine Kunden vorhanden.
                            </Typography>
                        ) : (
                            <TableContainer>
                                <Table size="small" aria-label="Kundentabelle">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><strong>Benutzername</strong></TableCell>
                                            <TableCell><strong>Professionell</strong></TableCell>
                                            <TableCell><strong>E-Mail</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customers.map((customer) => (
                                            <CustomerRow
                                                key={customer.user_name}
                                                customer={customer}
                                                onNotify={handleNotify}
                                            />
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </>
                )}
            </Stack>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
