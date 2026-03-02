import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#C28840',
            light: '#D4A865',
            dark: '#8A5F2C',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#5C3D11',
            contrastText: '#ffffff',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#1a1a2e',
            secondary: '#6b7280',
        },
        divider: '#e5e7eb',
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
        h5: {
            fontWeight: 700,
        },
        h6: {
            fontWeight: 600,
        },
        subtitle1: {
            fontWeight: 600,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 8,
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '6px 16px',
                },
                containedPrimary: {
                    boxShadow: '0 1px 3px rgba(194,136,64,0.4)',
                    '&:hover': {
                        boxShadow: '0 3px 8px rgba(194,136,64,0.45)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 0.2s ease, transform 0.15s ease',
                    '&:hover': {
                        boxShadow: '0 4px 12px rgba(0,0,0,0.10)',
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: '#f3f4f6',
                        fontWeight: 600,
                        color: '#374151',
                        borderBottom: '2px solid #e5e7eb',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td': {
                        borderBottom: 0,
                    },
                    '&:hover': {
                        backgroundColor: '#fafafa',
                    },
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    border: '1px solid #e5e7eb',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                },
            },
        },
        MuiAlert: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                },
            },
        },
        MuiPagination: {
            styleOverrides: {
                root: {
                    '& .MuiPaginationItem-root': {
                        borderRadius: 8,
                    },
                },
            },
        },
    },
});

export default theme;
