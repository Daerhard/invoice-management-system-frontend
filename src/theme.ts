import { createTheme } from '@mui/material/styles';

const GREEN = '#3D6B52';
const GREEN_DARK = '#2D5A43';

const theme = createTheme({
    palette: {
        primary: {
            main: GREEN,
            light: '#5A9174',
            dark: GREEN_DARK,
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#5A7A6A',
            light: '#7A9A8A',
            dark: '#3A5A4A',
            contrastText: '#ffffff',
        },
        background: {
            default: '#F5F4F0',
            paper: '#FFFFFF',
        },
        text: {
            primary: '#1A1A1A',
            secondary: '#6B7280',
        },
        divider: '#E5E5E2',
        action: {
            hover: 'rgba(61,107,82,0.06)',
        },
        success: {
            main: '#3D6B52',
            light: '#5A9174',
            contrastText: '#fff',
        },
        error: {
            main: '#C0392B',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica Neue", "Arial", sans-serif',
        h5: { fontWeight: 700 },
        h6: { fontWeight: 600 },
        subtitle1: { fontWeight: 600 },
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
                    boxShadow: 'none',
                    '&:hover': { boxShadow: 'none' },
                },
                containedPrimary: {
                    background: GREEN,
                    '&:hover': { background: GREEN_DARK },
                },
                outlinedPrimary: {
                    borderColor: GREEN,
                    '&:hover': { backgroundColor: 'rgba(61,107,82,0.06)' },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    boxShadow: 'none',
                    border: '1px solid #E5E5E2',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    boxShadow: 'none',
                    border: '1px solid #E5E5E2',
                },
                elevation0: {
                    boxShadow: 'none',
                    border: '1px solid #E5E5E2',
                },
            },
        },
        MuiTableHead: {
            styleOverrides: {
                root: {
                    '& .MuiTableCell-root': {
                        backgroundColor: '#F5F4F0',
                        fontWeight: 600,
                        fontSize: '0.72rem',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        color: '#6B7280',
                        borderBottom: '1px solid #E5E5E2',
                    },
                },
            },
        },
        MuiTableRow: {
            styleOverrides: {
                root: {
                    '&:last-child td': { borderBottom: 0 },
                    '&:hover': { backgroundColor: '#FAFAF8' },
                },
            },
        },
        MuiTableContainer: {
            styleOverrides: {
                root: {
                    borderRadius: 12,
                    border: '1px solid #E5E5E2',
                    boxShadow: 'none',
                },
            },
        },
        MuiTabs: {
            styleOverrides: {
                indicator: {
                    backgroundColor: GREEN,
                    height: 2,
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.875rem',
                    '&.Mui-selected': {
                        color: GREEN,
                        fontWeight: 600,
                    },
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    borderRadius: 0,
                },
            },
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    borderRadius: 12,
                    border: 'none',
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
                    border: 'none',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontWeight: 600,
                    fontSize: '0.72rem',
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
                root: { borderColor: '#E5E5E2' },
            },
        },
        MuiOutlinedInput: {
            styleOverrides: {
                root: {
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: GREEN,
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: GREEN,
                    },
                },
            },
        },
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    '&.Mui-focused': { color: GREEN },
                },
            },
        },
    },
});

export default theme;
