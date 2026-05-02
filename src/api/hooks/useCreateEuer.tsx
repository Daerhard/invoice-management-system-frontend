import { useState } from 'react';
import { useAtom } from 'jotai';
import { euerReportsAtom } from '../../store/Global';
import { createEuer } from '../generated/euer';

export default function useCreateEuer() {
    const [, setEuerReports] = useAtom(euerReportsAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async (year: number): Promise<boolean> => {
        setError('');
        setLoading(true);
        try {
            const response = await createEuer({ year });
            setEuerReports((prev) =>
                [...prev, response.data].sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
            );
            return true;
        } catch (e: any) {
            const msg = e?.response?.data?.message;
            setError(msg ?? 'EÜR konnte nicht erstellt werden.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { handleCreate, loading, error, setError };
}
