import React, { useState } from 'react';
import { useAtom } from 'jotai';
import { refundsAtom } from '../../store/Global';
import { Refund } from '../generated/Schemas';
import { createRefund } from '../generated/refunds';
import { extractErrorMessage } from '../../helper/Utils';

export interface AddRefundFormState {
    description: string;
    setDescription: (value: string) => void;
    amount: string;
    setAmount: (value: string) => void;
    year: string;
    setYear: (value: string) => void;
    loading: boolean;
    message: string;
    setMessage: (value: string) => void;
    error: string;
    setError: (value: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function useAddRefundForm(): AddRefundFormState {
    const [, setRefunds] = useAtom(refundsAtom);

    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [year, setYear] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setYear('');
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
        const parsedYear = parseInt(year, 10);
        if (!year || isNaN(parsedYear) || parsedYear < 1900 || parsedYear > 2100) {
            setError('Bitte ein gültiges Jahr eingeben.');
            return;
        }
        setMessage('');
        setError('');
        setLoading(true);

        const refundData: Refund = {
            description: description.trim(),
            amount: parsedAmount,
            date: String(parsedYear),
        };

        try {
            const response = await createRefund({ refundData });
            setRefunds((prev) => [response.data, ...prev]);
            setMessage('Erstattung erfolgreich gespeichert!');
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
        year,
        setYear,
        loading,
        message,
        setMessage,
        error,
        setError,
        handleSubmit,
    };
}
