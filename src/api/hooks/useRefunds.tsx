import { useEffect } from 'react'
import { useAtom } from 'jotai/index'
import { refundsAtom } from '../../store/Global'
import { useGenericRequest } from './useGenericRequest'
import { getAllRefunds } from '../generated/refunds'


export default function useRefunds() {
    const [, setRefunds] = useAtom(refundsAtom)

    const { data: fetchedRefunds } = useGenericRequest(
        'refunds',
        () => getAllRefunds()
    );

    useEffect(() => {
        if (fetchedRefunds !== undefined) {
            setRefunds(fetchedRefunds.data);
        }
    }, [fetchedRefunds, setRefunds]);
}
