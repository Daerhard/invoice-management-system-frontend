import { useEffect } from 'react';
import { useAtom } from 'jotai/index';
import { savedInvoicesAtom } from '../../store/Global';
import { useSavedInvoicesQuery } from '../../queries/useSavedInvoicesQuery';

export default function useSavedInvoices() {
    const [, setSavedInvoices] = useAtom(savedInvoicesAtom);

    const query = useSavedInvoicesQuery();

    useEffect(() => {
        if (query.data !== undefined) {
            setSavedInvoices(query.data.data);
        }
    }, [query.data, setSavedInvoices]);

    return query;
}
