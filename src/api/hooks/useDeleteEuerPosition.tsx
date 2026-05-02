import { useState } from 'react';
import { useAtom } from 'jotai';
import { euerReportsAtom } from '../../store/Global';
import { deleteEuerPosition } from '../generated/euer';

export default function useDeleteEuerPosition() {
    const [, setEuerReports] = useAtom(euerReportsAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async (euerId: number, positionId: number): Promise<boolean> => {
        setError('');
        setLoading(true);
        try {
            await deleteEuerPosition(euerId, positionId);
            setEuerReports((prev) =>
                prev.map((r) => {
                    if (r.id !== euerId) return r;
                    return {
                        ...r,
                        positions: (r.positions ?? []).filter((p) => p.id !== positionId),
                    };
                })
            );
            return true;
        } catch {
            setError('Position konnte nicht gelöscht werden.');
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, loading, error };
}
