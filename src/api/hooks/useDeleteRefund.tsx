import { useState } from 'react';
import { useAtom } from 'jotai';
import { refundsAtom } from '../../store/Global';
import { deleteRefund } from '../generated/refunds';

export default function useDeleteRefund(refundId: number) {
    const [, setRefunds] = useAtom(refundsAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setError('');
        setLoading(true);
        try {
            await deleteRefund(refundId);
            setRefunds((prev) => prev.filter((r) => r.id !== refundId));
        } catch {
            setError('Löschen fehlgeschlagen.');
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, loading, error };
}
