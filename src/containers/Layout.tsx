import React from 'react'
import { Box, Container } from '@mui/material'
import Menu from '../components/menu/Menu'
import CardmarketOrders from './cardmarketOrders/CardmarketOrders'
import Import from './import/Import'
import Statistik from './statistik/Statistik'
import Einkaeufe from './einkaeufe/Einkaeufe'
import Customers from './customers/Customers'
import Konto from './konto/Konto'
import { Navigate, Route, Routes } from 'react-router-dom'

export default function Layout() {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Menu />
            <Container maxWidth={false} sx={{ py: 4, flex: 1, maxWidth: '1400px !important' }}>
                <Routes>
                    <Route path="/" element={<Navigate to="/bestellungen" replace />} />
                    <Route path="/bestellungen" element={<CardmarketOrders/>} />
                    <Route path="/einkaeufe" element={<Einkaeufe/>} />
                    <Route path="/kunden" element={<Customers/>} />
                    <Route path="/statistik" element={<Statistik/>} />
                    <Route path="/import" element={<Import/>} />
                    <Route path="/konto" element={<Konto/>} />
                </Routes>
            </Container>
        </Box>
    );
}