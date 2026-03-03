import React from 'react'
import { Box, Card, CardActionArea, CardContent, Divider, Stack, Typography } from '@mui/material'
import ListAltIcon from '@mui/icons-material/ListAlt'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import BarChartIcon from '@mui/icons-material/BarChart'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import { useNavigate } from 'react-router-dom'
import useCardmarketOrders from '../../api/hooks/useCardmarketOrders'

const sections = [
    {
        to: '/bestellungen',
        label: 'Bestellungen',
        description: 'Übersicht aller Cardmarket-Bestellungen',
        icon: <ListAltIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
        to: '/einkaeufe',
        label: 'Einkäufe',
        description: 'Einkäufe manuell erfassen und verwalten',
        icon: <ShoppingCartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
        to: '/statistik',
        label: 'Statistik',
        description: 'Auswertungen und Statistiken anzeigen',
        icon: <BarChartIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
    {
        to: '/import',
        label: 'Import',
        description: 'Bestellungen aus CSV-Dateien importieren',
        icon: <UploadFileIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
    },
]

export default function Home() {
    useCardmarketOrders()

    const navigate = useNavigate()

    return (
        <Box sx={{ width: '100%' }}>
            <Stack spacing={4}>
                <Box>
                    <Typography variant="h4" fontWeight={700}>
                        Willkommen bei InvoiceMS
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
                        Wählen Sie einen Bereich aus, um zu beginnen.
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>
                <Stack
                    direction="row"
                    flexWrap="wrap"
                    gap={3}
                >
                    {sections.map(({ to, label, description, icon }) => (
                        <Card
                            key={to}
                            variant="outlined"
                            sx={{ width: 220, flexShrink: 0 }}
                        >
                            <CardActionArea
                                onClick={() => navigate(to)}
                                sx={{ p: 2, height: '100%' }}
                            >
                                <CardContent>
                                    <Stack spacing={1.5} alignItems="flex-start">
                                        {icon}
                                        <Typography variant="h6" fontWeight={600}>
                                            {label}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {description}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </Stack>
            </Stack>
        </Box>
    )
}
