import { useEffect } from 'react'
import { useAtom } from 'jotai/index'
import { cardmarketPurchasesAtom } from '../../store/Global'
import { useGenericRequest } from './useGenericRequest'
import { getPurchases } from '../generated/cardmarket-purchases'

export default function useCardmarketPurchases() {
    const [, setCardmarketPurchases] = useAtom(cardmarketPurchasesAtom)

    const { data: fetchedPurchases, isLoading, isError } = useGenericRequest(
        'cardmarketPurchases',
        () => getPurchases()
    );

    useEffect(() => {
        if (fetchedPurchases !== undefined) {
            setCardmarketPurchases(fetchedPurchases.data);
        }
    }, [fetchedPurchases, setCardmarketPurchases]);

    return { isLoading, isError };
}
