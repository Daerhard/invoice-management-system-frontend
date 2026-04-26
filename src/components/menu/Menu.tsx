import React from 'react'
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import { Link, useLocation } from 'react-router-dom'
import EuroIcon from '@mui/icons-material/Euro'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import BarChartIcon from '@mui/icons-material/BarChart'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import DescriptionIcon from '@mui/icons-material/Description'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'

export const SIDEBAR_WIDTH = 220;

const SIDEBAR_BG = '#191917';
const ACTIVE_BG = 'rgba(61,107,82,0.22)';
const ACTIVE_COLOR = '#6DBF93';
const NAV_TEXT = '#C8C8C4';
const SECTION_TEXT = '#5A5A56';

const navGroups = [
    {
        label: 'HAUPTMENÜ',
        links: [
            { to: '/einnahmen', label: 'Einnahmen', icon: <EuroIcon sx={{ fontSize: 17 }} /> },
            { to: '/einkaeufe', label: 'Ausgaben', icon: <ShoppingCartIcon sx={{ fontSize: 17 }} /> },
            { to: '/kunden', label: 'Kunden', icon: <PeopleAltIcon sx={{ fontSize: 17 }} /> },
        ],
    },
    {
        label: 'BERICHTE',
        links: [
            { to: '/statistik', label: 'Statistik', icon: <BarChartIcon sx={{ fontSize: 17 }} /> },
            { to: '/euer', label: 'EÜR', icon: <DescriptionIcon sx={{ fontSize: 17 }} /> },
            { to: '/konto', label: 'Konto', icon: <AccountCircleIcon sx={{ fontSize: 17 }} /> },
        ],
    },
];

export default function Menu() {
    const location = useLocation();

    return (
        <Box
            component="nav"
            sx={{
                width: SIDEBAR_WIDTH,
                flexShrink: 0,
                bgcolor: SIDEBAR_BG,
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                top: 0,
                left: 0,
                height: '100vh',
                zIndex: 1200,
                overflowY: 'auto',
            }}
        >
            <Box sx={{ px: 2.5, pt: 3, pb: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                    sx={{
                        width: 34,
                        height: 34,
                        borderRadius: 1.5,
                        bgcolor: '#3D6B52',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        color: '#fff',
                        fontSize: 14,
                    }}
                >
                    <FontAwesomeIcon icon={faFileInvoice} />
                </Box>
                <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', color: '#EFEFEB', lineHeight: 1.2 }}>
                        InvoiceMS
                    </Typography>
                    <Typography sx={{ fontSize: '0.68rem', color: SECTION_TEXT, lineHeight: 1.3 }}>
                        Rechnungsmanagement
                    </Typography>
                </Box>
            </Box>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)', mx: 0 }} />

            <Box sx={{ flex: 1, pt: 2, pb: 2 }}>
                {navGroups.map((group, gi) => (
                    <Box key={group.label} sx={{ mb: gi < navGroups.length - 1 ? 2.5 : 0 }}>
                        <Typography
                            sx={{
                                fontSize: '0.62rem',
                                fontWeight: 600,
                                letterSpacing: '0.09em',
                                color: SECTION_TEXT,
                                px: 2.5,
                                pb: 0.75,
                                textTransform: 'uppercase',
                            }}
                        >
                            {group.label}
                        </Typography>
                        <List disablePadding>
                            {group.links.map(({ to, label, icon }) => {
                                const active = location.pathname === to;
                                return (
                                    <ListItem key={to} disablePadding sx={{ px: 1.25, mb: 0.25 }}>
                                        <ListItemButton
                                            component={Link}
                                            to={to}
                                            sx={{
                                                borderRadius: 1.5,
                                                px: 1.5,
                                                py: 0.875,
                                                color: active ? ACTIVE_COLOR : NAV_TEXT,
                                                bgcolor: active ? ACTIVE_BG : 'transparent',
                                                '&:hover': {
                                                    bgcolor: active ? ACTIVE_BG : 'rgba(255,255,255,0.05)',
                                                    color: active ? ACTIVE_COLOR : '#DEDED8',
                                                },
                                                transition: 'background-color 0.15s ease, color 0.15s ease',
                                                minHeight: 'unset',
                                            }}
                                        >
                                            <ListItemIcon sx={{ minWidth: 30, color: 'inherit' }}>
                                                {icon}
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={label}
                                                primaryTypographyProps={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: active ? 600 : 400,
                                                    lineHeight: 1.4,
                                                }}
                                            />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </List>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
