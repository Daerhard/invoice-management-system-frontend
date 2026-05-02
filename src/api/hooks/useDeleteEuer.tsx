import { useState } from 'react';
import { useAtom } from 'jotai';
import { euerReportsAtom } from '../../store/Global';
import { deleteEuer } from '../generated/euer';

export default function useDeleteEuer() {
    const [, setEuerReports] = useAtom(euerReportsAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async (id: number): Promise<boolean> => {
        setError('');
        setLoading(true);
        try {
            await deleteEuer(id);
            setEuerReports((prev) => prev.filter((r) => r.id !== id));
            return true;
        } catch {
            setError('EÜR konnte nicht gelöscht werden.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, loading, error };
}
