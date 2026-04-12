import { useState } from 'react';
import { useAtom } from 'jotai';
import { suppliesAtom } from '../../store/Global';
import { deleteSupply } from '../generated/supplies';

export default function useDeleteSupply(supplyId: number) {
    const [, setSupplies] = useAtom(suppliesAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setError('');
        setLoading(true);
        try {
            await deleteSupply(supplyId);
            setSupplies((prev) => prev.filter((s) => s.id !== supplyId));
        } catch {
            setError('Löschen fehlgeschlagen.');
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, loading, error };
}
