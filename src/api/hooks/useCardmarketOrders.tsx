import { useEffect } from 'react'
import { useAtom } from 'jotai/index'
import { cardmarketOrdersAtom } from '../../store/Global'
import { useGenericRequest } from './useGenericRequest'
import { getOrders } from '../generated/orders'


export default function useCardmarketOrders () {
    const [,setCardmarketOrders] = useAtom(cardmarketOrdersAtom)

    const { data: fetchedOrders } = useGenericRequest(
        'cardmarketOrders',
        () => getOrders()
    );

    useEffect(() => {
        if (fetchedOrders !== undefined && fetchedOrders.data.length > 0) {
            setCardmarketOrders(fetchedOrders.data);
        }
    }, [fetchedOrders, setCardmarketOrders]);

}