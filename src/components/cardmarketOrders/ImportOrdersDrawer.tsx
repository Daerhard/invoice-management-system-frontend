import React from 'react';
import { Box, Divider, Drawer, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CSVImportComponent from '../import/CSVImportComponent';

interface ImportOrdersDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function ImportOrdersDrawer({ open, onClose }: ImportOrdersDrawerProps) {
    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{ width: 520, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Bestellungen importieren</Typography>
                    <IconButton onClick={onClose} aria-label="Drawer schließen" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <CSVImportComponent />
            </Box>
        </Drawer>
    );
}
