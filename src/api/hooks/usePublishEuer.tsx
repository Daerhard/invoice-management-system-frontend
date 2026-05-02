import { useState } from 'react';
import { useAtom } from 'jotai';
import { euerReportsAtom } from '../../store/Global';
import { publishEuer } from '../generated/euer';
import { EuerReport } from '../generated/Schemas';

export default function usePublishEuer() {
    const [, setEuerReports] = useAtom(euerReportsAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handlePublish = async (id: number): Promise<EuerReport | null> => {
        setError('');
        setLoading(true);
        try {
            const response = await publishEuer(id);
            const updated = response.data;
            setEuerReports((prev) =>
                prev.map((r) => (r.id === id ? updated : r))
            );
            return updated;
        } catch {
            setError('EÜR konnte nicht veröffentlicht werden.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handlePublish, loading, error };
}
