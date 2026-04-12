import React, { useState } from 'react';
import { useAtom } from 'jotai';
import axios from 'axios';
import { purchaseInvoicesAtom } from '../../store/Global';
import { PurchaseInvoice, PurchaseInvoiceItem, PurchaseInvoiceItemPurchaseType } from '../generated/Schemas';

export interface AddPurchaseInvoiceItemFormState {
    purchaseType: PurchaseInvoiceItemPurchaseType;
    setPurchaseType: (value: PurchaseInvoiceItemPurchaseType) => void;
    amount: string;
    setAmount: (value: string) => void;
    price: string;
    setPrice: (value: string) => void;
    invoiceDate: string;
    setInvoiceDate: (value: string) => void;
    pdfFile: File | null;
    loading: boolean;
    message: string;
    setMessage: (value: string) => void;
    error: string;
    setError: (value: string) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function useAddPurchaseInvoiceItemForm(
    invoiceId: number
): AddPurchaseInvoiceItemFormState {
    const [, setPurchaseInvoices] = useAtom(purchaseInvoicesAtom);

    const [purchaseType, setPurchaseType] = useState<PurchaseInvoiceItemPurchaseType>(
        PurchaseInvoiceItemPurchaseType.DISPLAY
    );
    const [amount, setAmount] = useState('');
    const [price, setPrice] = useState('');
    const [invoiceDate, setInvoiceDate] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setPurchaseType(PurchaseInvoiceItemPurchaseType.DISPLAY);
        setAmount('');
        setPrice('');
        setInvoiceDate('');
        setPdfFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0] ?? null;
        if (selected && selected.type === 'application/pdf') {
            setPdfFile(selected);
            setError('');
        } else {
            setError('Bitte eine gültige PDF-Datei auswählen.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const parsedAmount = parseInt(amount, 10);
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedAmount) || parsedAmount < 1) {
            setError('Bitte eine gültige Anzahl eingeben.');
            return;
        }
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            setError('Bitte einen gültigen Preis eingeben.');
            return;
        }
        if (!invoiceDate) {
            setError('Bitte ein Datum eingeben.');
            return;
        }
        setMessage('');
        setError('');
        setLoading(true);

        const itemData: PurchaseInvoiceItem = {
            purchaseType,
            amount: parsedAmount,
            price: parsedPrice,
            invoiceDate,
        };

        const formData = new FormData();
        formData.append(
            'itemData',
            new Blob([JSON.stringify(itemData)], { type: 'application/json' })
        );
        if (pdfFile) {
            formData.append('pdf', pdfFile, pdfFile.name);
        }

        try {
            const response = await axios.post<PurchaseInvoice>(
                `/v1/purchase-invoices/${invoiceId}/items`,
                formData
            );
            setPurchaseInvoices((prev) =>
                prev.map((inv) => (inv.id === invoiceId ? response.data : inv))
            );
            setMessage('Position erfolgreich hinzugefügt!');
            resetForm();
        } catch (err: unknown) {
            const msg =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
                    ? (err as { response: { data: { message: string } } }).response.data.message
                    : '';
            setError(`Hinzufügen fehlgeschlagen.${msg ? ` ${msg}` : ''}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        purchaseType,
        setPurchaseType,
        amount,
        setAmount,
        price,
        setPrice,
        invoiceDate,
        setInvoiceDate,
        pdfFile,
        loading,
        message,
        setMessage,
        error,
        setError,
        handleFileChange,
        handleSubmit,
    };
}
