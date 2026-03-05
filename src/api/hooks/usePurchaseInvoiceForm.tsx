import React, { useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import axios from 'axios';
import { cardmarketOrdersAtom, purchaseInvoicesAtom } from '../../store/Global';
import { PurchaseInvoice } from '../generated/Schemas';

export interface PurchaseInvoiceFormState {
    konamiSets: string[];
    produktname: string | null;
    setProduktname: (value: string | null) => void;
    anzahlDisplays: string;
    setAnzahlDisplays: (value: string) => void;
    preis: string;
    setPreis: (value: string) => void;
    datum: string;
    setDatum: (value: string) => void;
    pdfFile: File | null;
    loading: boolean;
    message: string;
    setMessage: (value: string) => void;
    error: string;
    setError: (value: string) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function usePurchaseInvoiceForm(): PurchaseInvoiceFormState {
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom);
    const [, setPurchaseInvoices] = useAtom(purchaseInvoicesAtom);

    const konamiSets = useMemo(() => {
        const sets = new Set<string>();
        cardmarketOrders.forEach((order) =>
            order.orderItems?.forEach((item) => {
                const konamiSet = item.card?.id?.konamiSet;
                if (konamiSet) sets.add(konamiSet);
            })
        );
        return Array.from(sets).sort();
    }, [cardmarketOrders]);

    const [produktname, setProduktname] = useState<string | null>(null);
    const [anzahlDisplays, setAnzahlDisplays] = useState('');
    const [preis, setPreis] = useState('');
    const [datum, setDatum] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setProduktname(null);
        setAnzahlDisplays('');
        setPreis('');
        setDatum('');
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
        if (!produktname) {
            setError('Bitte einen Produktnamen auswählen.');
            return;
        }
        if (!pdfFile) {
            setError('Bitte eine PDF-Datei auswählen.');
            return;
        }
        const parsedAmount = parseInt(anzahlDisplays, 10);
        const parsedPrice = parseFloat(preis);
        if (isNaN(parsedAmount) || parsedAmount < 1) {
            setError('Bitte eine gültige Anzahl Displays eingeben.');
            return;
        }
        if (isNaN(parsedPrice) || parsedPrice < 0) {
            setError('Bitte einen gültigen Preis eingeben.');
            return;
        }
        setMessage('');
        setError('');
        setLoading(true);

        const invoiceData: PurchaseInvoice = {
            id: 0,
            productName: produktname,
            amount: parsedAmount,
            price: parsedPrice,
            invoiceDate: datum,
        };

        const formData = new FormData();
        // Append invoiceData as a JSON Blob so the backend receives the correct
        // Content-Type (application/json) for this multipart part and can
        // deserialize it with @RequestPart.
        formData.append(
            'invoiceData',
            new Blob([JSON.stringify(invoiceData)], { type: 'application/json' })
        );
        formData.append('pdf', pdfFile, pdfFile.name);

        try {
            const response = await axios.post<PurchaseInvoice>('/v1/purchase-invoices', formData);
            setPurchaseInvoices((prev) => {
                const updated = [...prev, response.data];
                return updated.sort(
                    (a, b) => new Date(b.invoiceDate).getTime() - new Date(a.invoiceDate).getTime()
                );
            });
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
        konamiSets,
        produktname,
        setProduktname,
        anzahlDisplays,
        setAnzahlDisplays,
        preis,
        setPreis,
        datum,
        setDatum,
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
