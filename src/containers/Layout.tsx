import React from 'react'
import { Box, Container } from '@mui/material'
import Menu from '../components/menu/Menu'
import CardmarketOrders from './cardmarketOrders/CardmarketOrders'
import Import from './import/Import'
import Statistik from './statistik/Statistik'
import Einkaeufe from './einkaeufe/Einkaeufe'
import { Route, Routes } from 'react-router-dom'

export default function Layout() {

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'background.default' }}>
            <Menu />
            <Container maxWidth={false} sx={{ py: 4, flex: 1, maxWidth: '1400px !important' }}>
                <Routes>
                    <Route path="/bestellungen" element={<CardmarketOrders/>} />
                    <Route path="/einkaeufe" element={<Einkaeufe/>} />
                    <Route path="/statistik" element={<Statistik/>} />
                    <Route path="/import" element={<Import/>} />
                </Routes>
            </Container>
        </Box>
    );
}