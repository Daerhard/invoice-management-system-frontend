import { useEffect } from 'react'
import { useAtom } from 'jotai/index'
import { purchaseInvoicesAtom } from '../../store/Global'
import { useGenericRequest } from './useGenericRequest'
import { getAllPurchaseInvoices } from '../generated/purchase-invoices'


export default function usePurchaseInvoices() {
    const [, setPurchaseInvoices] = useAtom(purchaseInvoicesAtom)

    const { data: fetchedInvoices } = useGenericRequest(
        'purchaseInvoices',
        () => getAllPurchaseInvoices()
    );

    useEffect(() => {
        if (fetchedInvoices !== undefined) {
            setPurchaseInvoices(fetchedInvoices.data);
        }
    }, [fetchedInvoices, setPurchaseInvoices]);
}
