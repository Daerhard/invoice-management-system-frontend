import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { suppliesAtom } from '../../store/Global';
import { Supply } from '../generated/Schemas';
import { createSupply } from '../generated/supplies';
import { extractErrorMessage } from '../../helper/Utils';

export interface AddSupplyFormState {
    description: string;
    setDescription: (value: string) => void;
    amount: string;
    setAmount: (value: string) => void;
    date: string;
    setDate: (value: string) => void;
    pdfFile: File | null;
    loading: boolean;
    message: string;
    setMessage: (value: string) => void;
    error: string;
    setError: (value: string) => void;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function useAddSupplyForm(): AddSupplyFormState {
    const [, setSupplies] = useAtom(suppliesAtom);

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setDate('');
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
        const parsedAmount = parseFloat(amount);
        if (!description.trim()) {
            setError('Bitte eine Beschreibung eingeben.');
            return;
        }
        if (isNaN(parsedAmount) || parsedAmount < 0) {
            setError('Bitte einen gültigen Betrag eingeben.');
            return;
        }
        if (!date) {
            setError('Bitte ein Datum eingeben.');
            return;
        }
        setMessage('');
        setError('');
        setLoading(true);

        const supplyData: Supply = {
            description: description.trim(),
            amount: parsedAmount,
            date,
        };

        try {
            const response = await createSupply({ supplyData, pdf: pdfFile ?? undefined });
            setSupplies((prev) => [response.data, ...prev]);
            setMessage('Arbeitsmittel erfolgreich gespeichert!');
            resetForm();
        } catch (err: unknown) {
            const msg = extractErrorMessage(err);
            setError(`Speichern fehlgeschlagen.${msg ? ` ${msg}` : ''}`);
        } finally {
            setLoading(false);
        }
    };

    return {
        description,
        setDescription,
        amount,
        setAmount,
        date,
        setDate,
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
