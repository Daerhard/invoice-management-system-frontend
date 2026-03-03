import { Box, Divider, Stack, Typography } from '@mui/material'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import CSVImportComponent from '../../components/import/CSVImportComponent'


export default function Import(){

    return (
        <Box style={{ width:'100%' }}>
            <Stack spacing={3}>
                <Box>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        <UploadFileIcon sx={{ color: 'primary.main', fontSize: 28 }} />
                        <Typography variant="h5">Import</Typography>
                    </Stack>
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