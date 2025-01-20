import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip } from '@mui/material'
import { getInvoicesPDF } from '../../api/generated/invoice-generation-pd-f';
import { AxiosResponse } from 'axios'
import { useAtom } from 'jotai/index'
import { endDateSelectAtom, startDateSelectAtom } from '../../store/Global'
import { getGermanMonthName } from '../../helper/Utils'

export default function CreatePDFInvoicesByDateRange() {
    const [open, setOpen] = useState(false);
    const [pdfInvoices, setPdfInvoices] = useState<Blob | null>(null);
    const [startDate] = useAtom(startDateSelectAtom)
    const [endDate] = useAtom(endDateSelectAtom)

    const formattedStartDate = startDate.format('YYYY-MM-DD').toString()
    const formattedEndDate = endDate.format('YYYY-MM-DD').toString()

    const downloadInvoices = async () => {
        try {
            const response = await getInvoicesPDF<AxiosResponse<Blob>>(formattedStartDate, formattedEndDate, {
                responseType: 'blob',
            });
            setPdfInvoices(response.data);
        } catch (err) {
            console.error('Error downloading invoices:', err);
        }
    };

    const handleClickOpen = () => {
        downloadInvoices()
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDownload = () => {
        if (!pdfInvoices) return

        const url = URL.createObjectURL(pdfInvoices)
        const fileName = `Rechnungen ${startDate.format('DD-MM-YYYY').toString()} - ${endDate.format('DD-MM-YYYY').toString()}.zip`
        const a = document.createElement('a')
        a.href = url
        a.download = fileName
        a.click()
        URL.revokeObjectURL(url)
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Rechnungen herunterladen
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Rechnungen für folgenden Zeitraum downloaden.</DialogTitle>
                <DialogContent>
                    {`Zeitraum ${startDate.date()}. ${getGermanMonthName(startDate.month())} ${startDate.year()} 
                    - ${endDate.date()}. ${getGermanMonthName(endDate.month())} ${endDate.year()}`}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Schließen
                    </Button>
                    <Tooltip
                        title={!pdfInvoices ? 'Keine Rechnungen vorhanden' : ''}
                        placement="bottom"
                        arrow
                    >
                    <Button onClick={handleDownload} disabled={!pdfInvoices}>
                        Download ZIP-Datei
                    </Button>
                    </Tooltip>
                </DialogActions>
            </Dialog>
        </div>
    );
}
