import React from 'react'
import { Box, Grid2 } from '@mui/material'
import Menu from '../components/menu/Menu'
import CardmarketOrders from './cardmarketOrders/CardmarketOrders'
import Import from './import/Import'
import { Route, Routes } from 'react-router-dom'

export default function Layout() {

    return (
        <Box style={{
            width: '100%',
            margin: '0 auto',
            boxSizing: 'border-box',
            padding: '0 16px',
        }}
        >
          <Grid2 container
            direction="column"
            justifyContent="space-between"
            alignItems="baseline"
            gap={2}
            style={{ width: '100%' }}
          >
              <Menu></Menu>
              <Routes>
                  <Route path="/bestellungen" element={<CardmarketOrders/>} />
                  <Route path="/import" element={<Import/>} />
              </Routes>
          </Grid2>
        </Box>
    );
}