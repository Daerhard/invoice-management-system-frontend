import React, { useState } from 'react';
import { useAtom } from 'jotai';
import axios from 'axios';
import { purchaseInvoicesAtom } from '../../store/Global';
import { PurchaseInvoice } from '../generated/Schemas';

export interface PurchaseInvoiceFormState {
    konamiSets: string[];
    produktname: string;
    setProduktname: (value: string) => void;
    loading: boolean;
    message: string;
    setMessage: (value: string) => void;
    error: string;
    setError: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function usePurchaseInvoiceForm(): PurchaseInvoiceFormState {
    const [, setPurchaseInvoices] = useAtom(purchaseInvoicesAtom);

    const [produktname, setProduktname] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setProduktname('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!produktname.trim()) {
            setError('Bitte einen Produktnamen eingeben.');
            return;
        }
        setMessage('');
        setError('');
        setLoading(true);

        const invoiceData: PurchaseInvoice = {
            productName: produktname.trim(),
        };

        try {
            const response = await axios.post<PurchaseInvoice>('/v1/purchase-invoices', invoiceData);
            setPurchaseInvoices((prev) => [response.data, ...prev]);
            setMessage('Einkauf erfolgreich gespeichert!');
            resetForm();
        } catch (err: unknown) {
            const msg =
                typeof err === 'object' &&
                err !== null &&
                'response' in err &&
                typeof (err as { response?: { data?: { message?: string } } }).response?.data?.message === 'string'
                    ? (err as { response: { data: { message: string } } }).response.data.message
                    : '';
            setError(`Speichern fehlgeschlagen.${msg ? ` ${msg}` : ''}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        konamiSets: [],
        produktname,
        setProduktname,
        loading,
        message,
        setMessage,
        error,
        setError,
        handleSubmit,
    };
}
