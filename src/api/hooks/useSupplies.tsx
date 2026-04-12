import { useEffect } from 'react'
import { useAtom } from 'jotai/index'
import { suppliesAtom } from '../../store/Global'
import { useGenericRequest } from './useGenericRequest'
import { getAllSupplies } from '../generated/supplies'


export default function useSupplies() {
    const [, setSupplies] = useAtom(suppliesAtom)

    const { data: fetchedSupplies } = useGenericRequest(
        'supplies',
        () => getAllSupplies()
    );

    useEffect(() => {
        if (fetchedSupplies !== undefined) {
            setSupplies(fetchedSupplies.data);
        }
    }, [fetchedSupplies, setSupplies]);
}
