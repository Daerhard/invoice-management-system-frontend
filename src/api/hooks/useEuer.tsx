import { useEffect } from 'react';
import { useAtom } from 'jotai';
import { euerReportsAtom } from '../../store/Global';
import { useGenericRequest } from './useGenericRequest';
import { getAllEuer } from '../generated/euer';

export default function useEuer() {
    const [, setEuerReports] = useAtom(euerReportsAtom);

    const { data, isLoading, isError } = useGenericRequest(
        'euer',
        () => getAllEuer()
    );

    useEffect(() => {
        if (data !== undefined) {
            setEuerReports(data.data);
        }
    }, [data, setEuerReports]);

    return { isLoading, isError };
}
