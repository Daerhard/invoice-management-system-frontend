import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';
import { getPDFInvoices } from '../../api/generated/invoice-generation-pd-f';
import { AxiosResponse } from 'axios'
import { useAtom } from 'jotai/index'
import { endDateSelectAtom, startDateSelectAtom } from '../../store/Global'

export default function CreatePDFInvoicesByDateRange() {
    const [open, setOpen] = useState(false);
    const [pdfInvoices, setPdfInvoices] = useState<Blob | null>(null);
    const [startDate] = useAtom(startDateSelectAtom)
    const [endDate] = useAtom(endDateSelectAtom)

    const downloadInvoices = async () => {
        try {
            const response = await getPDFInvoices<AxiosResponse<Blob>>(startDate.toString(), endDate.toString(), {
                responseType: 'blob',
            });
            setPdfInvoices(response.data);
        } catch (err) {
            console.error('Error downloading invoices:', err);
        }
    };

    downloadInvoices()

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const handleDownload = () => {
        if (!pdfInvoices) return;

        const url = URL.createObjectURL(pdfInvoices);

        const fileName = startDate && endDate
            ? `Rechnungen_${startDate}-${endDate}.zip`
            : 'All_Invoices.zip';

        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={handleClickOpen}>
                Rechnungen herunterladen
            </Button>
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
                <DialogTitle>Rechnungen für Zeitraum herunterladen</DialogTitle>
                <DialogContent>
                    {pdfInvoices && (
                        <Typography>Rechnungen wurden erfolgreich geladen</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Schließen
                    </Button>
                    <Button onClick={handleDownload} disabled={!pdfInvoices}>
                        Download ZIP-Datei
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
