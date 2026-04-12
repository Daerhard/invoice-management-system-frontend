import { useState } from 'react';
import { useAtom } from 'jotai';
import { purchaseInvoicesAtom } from '../../store/Global';
import { deletePurchaseInvoiceItem } from '../generated/purchase-invoices';

export default function useDeletePurchaseInvoiceItem(invoiceId: number, itemId: number) {
    const [, setPurchaseInvoices] = useAtom(purchaseInvoicesAtom);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleDelete = async () => {
        setError('');
        setLoading(true);
        try {
            await deletePurchaseInvoiceItem(invoiceId, itemId);
            setPurchaseInvoices((prev) =>
                prev.map((inv) =>
                    inv.id === invoiceId
                        ? { ...inv, items: inv.items?.filter((item) => item.id !== itemId) }
                        : inv
                )
            );
        } catch {
            setError('Löschen fehlgeschlagen.');
        } finally {
            setLoading(false);
        }
    };

    return { handleDelete, loading, error };
}
