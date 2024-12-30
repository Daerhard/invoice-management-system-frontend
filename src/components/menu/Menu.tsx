import React from 'react'
import { Box, Stack, Avatar } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileInvoice } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import MenuItem from './MenuItem'

export default function Menu() {
    return (
        <Box
            style={{ width: '100%', borderBottom: '3px solid #C28840', marginBottom: '2rem' }}
        >
            <Stack sx={{ width: '100%', padding: '0.5rem' }} direction="row">
                <Avatar sx={{ backgroundColor: '#C28840' }}>
                    <FontAwesomeIcon icon={faFileInvoice} />
                </Avatar>
                <Link to="/bestellungen" style={{ textDecoration: 'none' }}>
                    <MenuItem title={'Bestellungen'} />
                </Link>
                <Link to="/import" style={{ textDecoration: 'none' }}>
                    <MenuItem title={'Import'} />
                </Link>
                <Link to="/einstellungen" style={{ textDecoration: 'none' }}>
                    <MenuItem title={'Einstellungen'} />
                </Link>
            </Stack>
        </Box>
    )
}
