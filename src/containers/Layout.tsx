import React from 'react'
import { Box } from '@mui/material'
import Menu, { SIDEBAR_WIDTH } from '../components/menu/Menu'
import Einnahmen from './einnahmen/Einnahmen'
import Statistik from './statistik/Statistik'
import Einkaeufe from './einkaeufe/Einkaeufe'
import Customers from './customers/Customers'
import Konto from './konto/Konto'
import Euer from './euer/Euer'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function Layout() {
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Menu />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    ml: `${SIDEBAR_WIDTH}px`,
                    minHeight: '100vh',
                    p: { xs: 3, md: 4 },
                }}
            >
                <Routes>
                    <Route path="/" element={<Navigate to="/einnahmen" replace />} />
                    <Route path="/bestellungen" element={<Navigate to="/einnahmen" replace />} />
                    <Route path="/einnahmen" element={<Einnahmen />} />
                    <Route path="/einkaeufe" element={<Einkaeufe />} />
                    <Route path="/kunden" element={<Customers />} />
                    <Route path="/statistik" element={<Statistik />} />
                    <Route path="/konto" element={<Konto />} />
                    <Route path="/euer" element={<Euer />} />
                </Routes>
            </Box>
        </Box>
    );
}
