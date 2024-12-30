import PDFInvoicePreview from '../../../containers/invoices/PDFInvoicePreview'
import React, { useState } from 'react'
import { faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'
import CustomIconButton from '../../../customComponents/CustomIconButton'
import { CardmarketOrder } from '../../../api/generated/Schemas'

interface PDFInvoiceProps {
    cardmarketOrder: CardmarketOrder
}

export default function CreatePDFInvoice({ cardmarketOrder }: Readonly<PDFInvoiceProps>) {
    const [showInvoicePreview, setShowInvoicePreview] = useState(false);
    const openInvoicePreview = () => setShowInvoicePreview(true);
    const closeInvoicePreview = () => setShowInvoicePreview(false);

    return(
        <div>
        <CustomIconButton
            title="Erstelle Rechnung (PDF)"
            titleVariant="body2"
            icon={faFileInvoiceDollar}
            iconSize="xs"
            onClick={openInvoicePreview}
        />
            <PDFInvoicePreview
                cardmarketOrder={cardmarketOrder}
                open={showInvoicePreview}
                onClose={closeInvoicePreview}
            />
        </div>
    )
}