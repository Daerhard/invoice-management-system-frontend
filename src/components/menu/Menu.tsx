import React from 'react'
import { AppBar, Avatar, Box, Button, Toolbar, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation } from 'react-router-dom'

const navLinks = [
    { to: '/bestellungen', label: 'Bestellungen' },
    { to: '/einkaeufe', label: 'Einkäufe' },
    { to: '/kunden', label: 'Kunden' },
    { to: '/statistik', label: 'Statistik' },
    { to: '/import', label: 'Import' },
    { to: '/einstellungen', label: 'Einstellungen' },
];

export default function Menu() {
    const location = useLocation()

    return (
        <AppBar
            position="static"
            elevation={0}
            sx={{
                bgcolor: 'background.paper',
                borderBottom: '3px solid',
                borderColor: 'primary.main',
                color: 'text.primary',
            }}
        >
            <Toolbar sx={{ gap: 1, px: { xs: 2, sm: 3 } }}>
                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                    <FontAwesomeIcon icon={faFileInvoice} />
                </Avatar>
                <Typography
                    variant="h6"
                    sx={{ fontWeight: 700, color: 'primary.main', mr: 2, display: { xs: 'none', sm: 'block' } }}
                >
                    InvoiceMS
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {navLinks.map(({ to, label }) => {
                        const active = location.pathname === to;
                        return (
                            <Button
                                key={to}
                                component={Link}
                                to={to}
                                disableRipple={false}
                                sx={{
                                    color: active ? 'primary.main' : 'text.primary',
                                    fontWeight: active ? 700 : 500,
                                    borderRadius: 1,
                                    px: 1.5,
                                    py: 0.75,
                                    borderBottom: active ? '2px solid' : '2px solid transparent',
                                    borderColor: active ? 'primary.main' : 'transparent',
                                    '&:hover': {
                                        bgcolor: 'action.hover',
                                        color: 'primary.main',
                                        borderColor: 'primary.light',
                                    },
                                    transition: 'color 0.15s ease, border-color 0.15s ease',
                                }}
                            >
                                {label}
                            </Button>
                        );
                    })}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
