import React, { useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Snackbar,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import TuneIcon from '@mui/icons-material/Tune';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { useAtom } from 'jotai';
import { useProfessionalCustomersQuery } from '../../queries/useProfessionalCustomersQuery';
import { useUpdateCustomerEmailMutation } from '../../queries/useUpdateCustomerEmailMutation';
import { Customer } from '../../api/generated/Schemas';
import { customerPageEmailFilterAtom, customerPageNameFilterAtom } from '../../store/Global';
import CustomerPageFilterDrawer from '../../components/customers/filters/CustomerPageFilterDrawer';

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
    const isChanged = emailInput !== (customer.email ?? '');
    const showConfirm = isChanged && isValidEmail;

    const handleSave = () => {
        if (!showConfirm) return;
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
                <Stack direction="row" spacing={0.5} alignItems="flex-start">
                    <TextField
                        size="small"
                        type="email"
                        placeholder="E-Mail hinzufügen"
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        error={emailInput.length > 0 && !isValidEmail}
                        helperText={emailInput.length > 0 && !isValidEmail ? 'Ungültige E-Mail-Adresse' : ''}
                        sx={{ minWidth: 220 }}
                        inputProps={{ 'aria-label': `E-Mail für ${customer.user_name}` }}
                    />
                    {showConfirm && (
                        <Tooltip title="E-Mail speichern">
                            <span>
                                <IconButton
                                    color="success"
                                    size="small"
                                    onClick={handleSave}
                                    disabled={mutation.isPending}
                                    aria-label={`E-Mail für ${customer.user_name} speichern`}
                                    sx={{ mt: 0.5 }}
                                >
                                    {mutation.isPending ? (
                                        <CircularProgress size={18} color="inherit" />
                                    ) : (
                                        <CheckIcon fontSize="small" />
                                    )}
                                </IconButton>
                            </span>
                        </Tooltip>
                    )}
                </Stack>
            </TableCell>
        </TableRow>
    );
}

export default function Customers() {
    const { data, isLoading, isError } = useProfessionalCustomersQuery();
    const customers = data?.data ?? [];

    const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });
    const [drawerOpen, setDrawerOpen] = useState(false);

    const [nameFilter] = useAtom(customerPageNameFilterAtom);
    const [emailFilter] = useAtom(customerPageEmailFilterAtom);

    const filteredCustomers = useMemo(() => {
        const trimmedName = nameFilter.trim();
        return customers
            .filter((c) => !trimmedName || c.user_name.toLowerCase().includes(trimmedName.toLowerCase()))
            .filter((c) => {
                if (emailFilter === 'with_email') return !!c.email;
                if (emailFilter === 'without_email') return !c.email;
                return true;
            });
    }, [customers, nameFilter, emailFilter]);

    const handleNotify = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    return (
        <Box style={{ width: '100%' }}>
            <CustomerPageFilterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Stack spacing={3} width="100%">
                <Box>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Stack direction="row" alignItems="center" spacing={1.5}>
                            <PeopleAltIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                            <Typography variant="h5">Kunden</Typography>
                            {filteredCustomers.length > 0 && (
                                <Chip
                                    label={filteredCustomers.length}
                                    size="small"
                                    color="primary"
                                    sx={{ fontWeight: 600, borderRadius: 1 }}
                                />
                            )}
                        </Stack>
                        <Button
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<TuneIcon />}
                            onClick={() => setDrawerOpen(true)}
                        >
                            Filter
                        </Button>
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
                                        {filteredCustomers.map((customer) => (
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

