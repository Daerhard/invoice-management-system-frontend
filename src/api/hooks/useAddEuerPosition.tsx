import { useState } from 'react';
import { useAtom } from 'jotai';
import { euerReportsAtom } from '../../store/Global';
import { addEuerPosition } from '../generated/euer';
import { EuerPosition, EuerSection } from '../generated/Schemas';

export default function useAddEuerPosition() {
    const [, setEuerReports] = useAtom(euerReportsAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAdd = async (
        euerId: number,
        section: EuerSection,
        description: string,
        value: number
    ): Promise<EuerPosition | null> => {
        setError('');
        setLoading(true);
        try {
            const response = await addEuerPosition(euerId, { section, description, value });
            const newPosition = response.data;
            setEuerReports((prev) =>
                prev.map((r) => {
                    if (r.id !== euerId) return r;
                    return {
                        ...r,
                        positions: [...(r.positions ?? []), newPosition],
                    };
                })
            );
            return newPosition;
        } catch {
            setError('Position konnte nicht hinzugefügt werden.');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { handleAdd, loading, error, setError };
}
