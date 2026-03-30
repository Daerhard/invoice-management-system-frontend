import React from 'react';
import { TextField } from '@mui/material';
import { useAtom } from 'jotai';
import { customerPageNameFilterAtom } from '../../../store/Global';

export default function CustomerPageNameFilter() {
    const [nameFilter, setNameFilter] = useAtom(customerPageNameFilterAtom);

    return (
        <TextField
            variant="standard"
            label="Filter nach Name"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            inputProps={{ 'aria-label': 'Filter nach Kundenname' }}
            fullWidth
        />
    );
}
