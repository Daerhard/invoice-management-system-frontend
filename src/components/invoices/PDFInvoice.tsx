import React, { useEffect, useState } from 'react';
import { Stack, Box, IconButton, Typography } from '@mui/material'
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface InvoicePreviewProps {
    invoice: Blob;
}

export default function PDFInvoiceDialog({ invoice }: Readonly<InvoicePreviewProps>) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);

    useEffect(() => {
        setPageNumber(1);
    }, [invoice]);

    const handlePageChange = (direction: 'next' | 'prev') => {
        if (direction === 'next' && pageNumber < numPages) {
            setPageNumber(pageNumber + 1);
        } else if (direction === 'prev' && pageNumber > 1) {
            setPageNumber(pageNumber - 1);
        }
    };

    return (
        <Box sx={{ padding: '1rem' }}>
            <Stack direction="row" spacing={2} justifyContent="center" sx={{ marginBottom: '1rem' }}>
                <IconButton
                    onClick={() => handlePageChange('prev')}
                    disabled={pageNumber === 1}
                >
                    <FontAwesomeIcon icon={faAngleLeft} />
                </IconButton>
                <Typography variant="body2">
                    Page {pageNumber} of {numPages}
                </Typography>
                <IconButton
                    onClick={() => handlePageChange('next')}
                    disabled={pageNumber === numPages}
                    aria-label="Next Page"
                >
                    <FontAwesomeIcon icon={faAngleRight} />
                </IconButton>
            </Stack>
            <Document
                file={invoice}
                onLoadSuccess={({ numPages }) => setNumPages(numPages)}
                loading="Loading PDF..."
                noData="No PDF available."
                error="Failed to load PDF."
            >
                <Page pageNumber={pageNumber} />
            </Document>
        </Box>
    );
}
