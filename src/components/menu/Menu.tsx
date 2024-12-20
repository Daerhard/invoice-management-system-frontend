import React from 'react';
import { Avatar, Box, Stack } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import MenuItem from './MenuItem'

export default function Menu() {
    return (
        <Box
            style={{ width: '100%', borderBottom: '3px solid #C28840', marginBottom: '1rem' }}
        >
            <Stack sx={{ width: '100%', padding: '0.5rem' }} direction='row'>
                <Avatar sx={{ backgroundColor: '#C28840' }}>
                    <FontAwesomeIcon icon={faFileInvoice} />
                </Avatar>
                <MenuItem title={'Bestellungen'}></MenuItem>
                <MenuItem title={'Import'}></MenuItem>
                <MenuItem title={'Einstellungen'}></MenuItem>
            </Stack>
        </Box>
    );
}
