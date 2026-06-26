import React from 'react';
import { Box, Divider, Drawer, Grid2, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CustomerFilter from './CustomerFilter';
import CardmarketOrderFilter from './CardmarketOrderFilter';
import DateRangeFilter from './DateRangeFilter';
import CreateInvoicesPDFByDateRange from '../../invoices/CreateInvoicesPDFByDateRange';

interface FilterDrawerProps {
    open: boolean;
    onClose: () => void;
}

export default function FilterDrawer({ open, onClose }: FilterDrawerProps) {
    return (
        <Drawer anchor="left" open={open} onClose={onClose}>
            <Box sx={{ width: 480, padding: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
                    <Typography variant="h6">Filter</Typography>
                    <IconButton onClick={onClose} aria-label="Filter schließen" size="small">
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <Grid2 container spacing={2}>
                    <Grid2 size={6}>
                        <CustomerFilter />
                    </Grid2>
                    <Grid2 size={6}>
                        <CardmarketOrderFilter />
                    </Grid2>
                    <Grid2 size={12}>
                        <DateRangeFilter />
                    </Grid2>
                    <Grid2 size={12}>
                        <Divider sx={{ my: 1 }} />
                        <CreateInvoicesPDFByDateRange />
                    </Grid2>
                </Grid2>
            </Box>
        </Drawer>
    );
}
