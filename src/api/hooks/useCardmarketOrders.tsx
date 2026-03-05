import { useEffect } from 'react'
import { useAtom } from 'jotai/index'
import { cardmarketOrdersAtom } from '../../store/Global'
import { useOrdersQuery } from '../../queries/useOrdersQuery'


export default function useCardmarketOrders () {
    const [,setCardmarketOrders] = useAtom(cardmarketOrdersAtom)

    const query = useOrdersQuery();

    useEffect(() => {
        if (query.data !== undefined && query.data.data.length > 0) {
            setCardmarketOrders(query.data.data);
        }
    }, [query.data, setCardmarketOrders]);

    return query;
}