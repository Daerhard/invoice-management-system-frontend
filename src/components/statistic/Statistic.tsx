import { useAtom } from 'jotai/index'
import { cardmarketOrdersAtom } from '../../store/Global'


export default function Statistic() {
    const [cardmarketOrders] = useAtom(cardmarketOrdersAtom)

    const ordersTotalValue = cardmarketOrders.map((order) => order.total_value)


    return (
        <div>

        </div>
    )
}