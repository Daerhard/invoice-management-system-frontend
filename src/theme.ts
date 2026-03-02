import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6B46C1',
            light: '#9F7AEA',
            dark: '#4C1D95',
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#7C3AED',
            light: '#A78BFA',
            dark: '#5B21B6',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F5F3FF',
            paper: '#ffffff',
        },
        text: {
            primary: '#1E1B4B',
            secondary: '#6B7280',
        },
        divider: '#DDD6FE',
        action: {
            hover: 'rgba(107,70,193,0.06)',
        },
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
                    boxShadow: '0 1px 3px rgba(107,70,193,0.4)',
                    '&:hover': {
                        boxShadow: '0 3px 8px rgba(107,70,193,0.45)',
                    },
                },
                outlinedPrimary: {
                    borderColor: '#6B46C1',
                    '&:hover': {
                        backgroundColor: 'rgba(107,70,193,0.06)',
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    boxShadow: '0 1px 3px rgba(107,70,193,0.08), 0 1px 2px rgba(107,70,193,0.04)',
                    transition: 'box-shadow 0.2s ease, transform 0.15s ease',
                    '&:hover': {
                        boxShadow: '0 4px 14px rgba(107,70,193,0.13)',
                    },
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: '#EDE9FE',
                        fontWeight: 600,
                        color: '#4C1D95',
                        borderBottom: '2px solid #DDD6FE',
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
                        backgroundColor: '#FAF8FF',
                    },
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    border: '1px solid #DDD6FE',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: '#6B46C1',
                    height: 3,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    textTransform: 'none',
                    '&.Mui-selected': {
                        color: '#6B46C1',
                    },
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
        MuiDivider: {
            styleOverrides: {
                root: {
                    borderColor: '#DDD6FE',
                },
            },
        },
    },
});

export default theme;
