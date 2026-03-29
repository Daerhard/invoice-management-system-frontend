import React, { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Divider,
    Snackbar,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { User } from '../../api/generated/Schemas';
import { useUsersQuery } from '../../queries/useUsersQuery';
import { useCreateUserMutation } from '../../queries/useCreateUserMutation';
import { useUpdateUserMutation } from '../../queries/useUpdateUserMutation';

const EMPTY_FORM: Omit<User, 'id'> = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    zipCode: '',
    city: '',
    street: '',
    email: '',
};

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error';
}

export default function Konto() {
    const { data, isLoading, isError } = useUsersQuery();
    const users = data?.data ?? [];
    const existingUser: User | undefined = users[0];

    const createMutation = useCreateUserMutation();
    const updateMutation = useUpdateUserMutation();

    const [form, setForm] = useState<Omit<User, 'id'>>(EMPTY_FORM);
    const [snackbar, setSnackbar] = useState<SnackbarState>({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        if (existingUser) {
            setForm({
                username: existingUser.username,
                password: '',
                firstName: existingUser.firstName,
                lastName: existingUser.lastName,
                zipCode: existingUser.zipCode,
                city: existingUser.city,
                street: existingUser.street,
                email: existingUser.email,
            });
        }
    }, [existingUser]);

    const handleChange = (field: keyof Omit<User, 'id'>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (existingUser?.id !== undefined) {
            const userData: User = { ...form, id: existingUser.id };
            updateMutation.mutate(
                { id: existingUser.id, user: userData },
                {
                    onSuccess: () => setSnackbar({ open: true, message: 'Benutzerdaten erfolgreich gespeichert.', severity: 'success' }),
                    onError: () => setSnackbar({ open: true, message: 'Fehler beim Speichern der Benutzerdaten.', severity: 'error' }),
                }
            );
        } else {
            createMutation.mutate({ ...form }, {
                onSuccess: () => setSnackbar({ open: true, message: 'Benutzer erfolgreich angelegt.', severity: 'success' }),
                onError: () => setSnackbar({ open: true, message: 'Fehler beim Anlegen des Benutzers.', severity: 'error' }),
            });
        }
    };

    const isPending = createMutation.isPending || updateMutation.isPending;

    return (
        <Box style={{ width: '100%' }}>
            <Stack spacing={3} width="100%" maxWidth={600}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <AccountCircleIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5">Konto</Typography>
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        {existingUser ? 'Benutzerdaten bearbeiten' : 'Neuen Benutzer anlegen'}
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
                                Benutzerdaten konnten nicht geladen werden.
                            </Alert>
                        )}
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <Stack spacing={2}>
                                {existingUser?.id !== undefined && (
                                    <TextField
                                        label="ID"
                                        value={existingUser.id}
                                        disabled
                                        size="small"
                                        fullWidth
                                        inputProps={{ 'aria-label': 'Benutzer-ID' }}
                                    />
                                )}
                                <TextField
                                    label="Benutzername"
                                    value={form.username}
                                    onChange={handleChange('username')}
                                    size="small"
                                    fullWidth
                                    required
                                    inputProps={{ 'aria-label': 'Benutzername' }}
                                />
                                <TextField
                                    label="Passwort"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange('password')}
                                    size="small"
                                    fullWidth
                                    placeholder={existingUser ? '(unverändert lassen)' : ''}
                                    inputProps={{ 'aria-label': 'Passwort' }}
                                />
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Vorname"
                                        value={form.firstName}
                                        onChange={handleChange('firstName')}
                                        size="small"
                                        fullWidth
                                        required
                                        inputProps={{ 'aria-label': 'Vorname' }}
                                    />
                                    <TextField
                                        label="Nachname"
                                        value={form.lastName}
                                        onChange={handleChange('lastName')}
                                        size="small"
                                        fullWidth
                                        required
                                        inputProps={{ 'aria-label': 'Nachname' }}
                                    />
                                </Stack>
                                <TextField
                                    label="E-Mail"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange('email')}
                                    size="small"
                                    fullWidth
                                    required
                                    inputProps={{ 'aria-label': 'E-Mail' }}
                                />
                                <TextField
                                    label="Straße"
                                    value={form.street}
                                    onChange={handleChange('street')}
                                    size="small"
                                    fullWidth
                                    required
                                    inputProps={{ 'aria-label': 'Straße' }}
                                />
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="PLZ"
                                        value={form.zipCode}
                                        onChange={handleChange('zipCode')}
                                        size="small"
                                        fullWidth
                                        required
                                        inputProps={{ 'aria-label': 'PLZ' }}
                                    />
                                    <TextField
                                        label="Stadt"
                                        value={form.city}
                                        onChange={handleChange('city')}
                                        size="small"
                                        fullWidth
                                        required
                                        inputProps={{ 'aria-label': 'Stadt' }}
                                    />
                                </Stack>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isPending}
                                    sx={{ alignSelf: 'flex-start' }}
                                >
                                    {isPending ? (
                                        <CircularProgress size={20} color="inherit" />
                                    ) : existingUser ? (
                                        'Speichern'
                                    ) : (
                                        'Benutzer anlegen'
                                    )}
                                </Button>
                            </Stack>
                        </Box>
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
