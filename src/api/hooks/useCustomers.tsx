import { useAtom } from 'jotai/index'
import { customersAtom } from '../../store/Global'
import { useGenericRequest } from './useGenericRequest'
import { getAllCustomers } from '../generated/customers'
import { useEffect } from 'react'


export default function useCustomers(){
    const [,setCustomers] = useAtom(customersAtom)

    const { data: fetchedCustomers } = useGenericRequest(
        'customers',
        () => getAllCustomers()
    );

    useEffect(() => {
        if (fetchedCustomers !== undefined && fetchedCustomers.data.length > 0) {
            setCustomers(fetchedCustomers.data);
        }
    }, [fetchedCustomers, setCustomers]);

}