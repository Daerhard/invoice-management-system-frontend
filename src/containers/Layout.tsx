import React from 'react'
import { Box, Container } from '@mui/material'
import Menu from '../components/menu/Menu'
import Einnahmen from './einnahmen/Einnahmen'
import Statistik from './statistik/Statistik'
import Einkaeufe from './einkaeufe/Einkaeufe'
import Customers from './customers/Customers'
import Konto from './konto/Konto'
import Euer from './euer/Euer'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function Layout() {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Menu />
            <Container maxWidth={false} sx={{ py: 4, flex: 1, maxWidth: '1400px !important' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/einnahmen" replace />} />
                    <Route path="/bestellungen" element={<Navigate to="/einnahmen" replace />} />
                    <Route path="/einnahmen" element={<Einnahmen/>} />
                    <Route path="/einkaeufe" element={<Einkaeufe/>} />
                    <Route path="/kunden" element={<Customers/>} />
                    <Route path="/statistik" element={<Statistik/>} />
                    <Route path="/konto" element={<Konto/>} />
                    <Route path="/euer" element={<Euer/>} />
                </Routes>
            </Container>
        </Box>
    );
}