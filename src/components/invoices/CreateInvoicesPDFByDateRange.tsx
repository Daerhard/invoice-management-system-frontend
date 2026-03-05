import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Tooltip } from '@mui/material'
import { getInvoicesPDF } from '../../api/generated/invoice-generation-pd-f';
import { useAtom } from 'jotai/index'
import { cardmarketOrdersAtom, endDateSelectAtom, startDateSelectAtom } from '../../store/Global'
import { getGermanMonthName } from '../../helper/Utils'
import dayjs from 'dayjs'
import { useMemo } from 'react'

export default function CreateInvoicesPDFByDateRange() {
    const [open, setOpen] = useState(false);
    const [pdfInvoices, setPdfInvoices] = useState<Blob | null>(null);
    const [startDate] = useAtom(startDateSelectAtom)
    const [endDate] = useAtom(endDateSelectAtom)
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)

    const firstOrderDate = useMemo(() => {
        if (cardmarketOrders.length === 0) return dayjs()
        const earliest = Math.min(...cardmarketOrders.map((o) => new Date(o.payment_date).getTime()))
        return dayjs(earliest).startOf('day')
    }, [cardmarketOrders])

    const effectiveStartDate = startDate ?? firstOrderDate
    const effectiveEndDate = endDate ?? dayjs().endOf('day')

    const formattedStartDate = effectiveStartDate.format('YYYY-MM-DD').toString()
    const formattedEndDate = effectiveEndDate.format('YYYY-MM-DD').toString()

    const downloadInvoices = async () => {
        try {
            const response = await getInvoicesPDF(formattedStartDate, formattedEndDate, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], {
                type: 'application/zip',
            });

            setPdfInvoices(blob);
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
        const fileName = `Rechnungen ${effectiveStartDate.format('DD-MM-YYYY').toString()} - ${effectiveEndDate.format('DD-MM-YYYY').toString()}.zip`
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
                    {`Zeitraum ${effectiveStartDate.date()}. ${getGermanMonthName(effectiveStartDate.month())} ${effectiveStartDate.year()} 
                    - ${effectiveEndDate.date()}. ${getGermanMonthName(effectiveEndDate.month())} ${effectiveEndDate.year()}`}
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
