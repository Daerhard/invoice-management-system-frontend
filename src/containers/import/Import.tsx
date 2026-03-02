import { Box, Divider, Stack, Typography } from '@mui/material'
import CSVImportComponent from '../../components/import/CSVImportComponent'


export default function Import(){

    return (
        <Box style={{ width:'100%' }}>
            <Stack spacing={3}>
                <Box>
                    <Typography variant="h5">Import</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                        Bestelldaten aus externen Dateien importieren
                    </Typography>
                    <Divider sx={{ mt: 2 }} />
                </Box>
                <CSVImportComponent />
            </Stack>
        </Box>
    )
}